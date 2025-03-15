import { ContentGenerator, FileTemplateMap, ProjectInfo } from '../types';
import { FileService } from './file';

/**
 * Service for generating documentation files.
 */
export class DocumentationGenerator {
  private contentGenerator: ContentGenerator | null;
  private fileService: FileService;
  private templates: FileTemplateMap;
  
  /**
   * Creates a new DocumentationGenerator instance.
   * @param templates The file templates to use.
   * @param fileService The file service to use for file operations.
   * @param contentGenerator Optional content generator for AI-powered content.
   */
  constructor(
    templates: FileTemplateMap,
    fileService: FileService,
    contentGenerator: ContentGenerator | null = null
  ) {
    this.templates = templates;
    this.fileService = fileService;
    this.contentGenerator = contentGenerator;
  }
  
  /**
   * Generates all documentation files in the given directory.
   * @param dirPath The directory to generate files in.
   * @param projectInfo Optional project information for enhanced templates.
   * @returns A promise that resolves to the generated file count.
   */
  async generateDocumentation(dirPath: string, projectInfo?: ProjectInfo): Promise<number> {
    let createdCount = 0;
    
    // If no project info is provided, create a basic one with just the project name
    const basicProjectInfo: ProjectInfo = projectInfo || {
      name: this.fileService.getBaseName(dirPath),
      description: 'A new software project.',
      author: '',
      license: 'MIT',
      sections: {},
    };
    
    // We'll use a staged approach, generating core documents first then using them for other docs
    const generatedContent: Record<string, string> = {};
    
    // First, generate VISION.md from the brain dump
    if (projectInfo && projectInfo.sections._brainDump?.content) {
      // Get the brain dump content and project name
      const brainDump = projectInfo.sections._brainDump.content;
      const projectName = projectInfo.name;
      
      // Define the generation order for the staged approach
      const generationOrder = [
        'VISION.md', // Generate first from brain dump
        'PLAN.md',   // Generate second using brain dump + VISION.md
        'README.md', // Use both VISION.md and PLAN.md as context
        'AESTHETIC.md',
        'ARCHITECTURE.md',
        'CHECKLIST.md',
        'TODO.md',
        'BUG.md',
        'DEVREF.md'
      ];
      
      // Get Claude command files from templates
      const claudeCommandFiles = Object.keys(this.templates).filter(key => key.startsWith('.claude/'));
      
      // Process templates in the defined order
      for (const fileName of [...generationOrder, ...claudeCommandFiles]) {
        const template = this.templates[fileName];
        if (!template) continue;
        
        const filePath = this.fileService.resolvePath(dirPath, fileName);
        
        // Only create file if it doesn't already exist
        if (!this.fileService.exists(filePath)) {
          let content: string | null = null;
          
          if (this.contentGenerator?.isAvailable()) {
            try {
              // Build a custom prompt based on the document type and available context
              let prompt: string;
              
              switch (fileName) {
                case 'VISION.md':
                  // Vision is generated directly from the brain dump, using the program-vision.md reference
                  prompt = `Create a comprehensive VISION.md file for a project named "${projectName}".
                  
Use the following information provided by the project creator:
${brainDump}

Craft a clear, compelling VISION.md document that captures the product's essence and direction. This document will anchor all future product planning and development.

Focus on these key elements:

1. Product Essence
   - Clearly articulate the core product purpose and the central user problem it solves.
   - Highlight the ideal user and how the product enhances their experience or addresses their needs.

2. Benefits and Value
   - Emphasize transformative user benefits and experiences rather than features or technical specifics.
   - Identify the product's unique value proposition—why it's different and better than alternatives.

3. User Experience
   - Describe the overall user experience you aim to deliver, prioritizing simplicity, intuitiveness, and delight.
   - Connect UX explicitly to user outcomes and the core product value.

4. Success
   - Define clear, focused success metrics tied directly to user satisfaction and impact.

Keep the vision concise, inspiring, and focused on clarity, user benefits, and product impact.
Format in professional Markdown with appropriate headings and styling.`;
                  break;
                  
                case 'PLAN.md':
                  // Plan uses both brain dump and VISION.md if available
                  prompt = `Create a detailed PLAN.md file for a project named "${projectName}".

Use the following information provided by the project creator:
${brainDump}

${generatedContent['VISION.md'] ? `Based on the project vision described in VISION.md:\n${generatedContent['VISION.md']}\n` : ''}

Craft a detailed, technical, and actionable PLAN.md file to guide immediate development. This document should clearly translate a specific, achievable portion of the overall vision into explicit, implementable engineering tasks.

Focus on these key elements:

1. Clear Scope
   - Precisely define the immediate, actionable piece of the product vision this plan addresses.
   - Explicitly state the user or technical problem you're solving now.
   - Recommend either a web application (preferred for user-facing products) or CLI/TUI (preferred for developer tools).

2. Technical Approach
   - Strongly prefer these technologies when applicable:
     - Languages: TypeScript, JavaScript, Go, Rust
     - Frontend: Next.js, React, Tailwind CSS
     - Backend: Fastify, Express, Go standard library
     - Infrastructure: Docker, Kubernetes
     - AI: OpenAI, Anthropic Claude, Google Gemini APIs
   - Clearly outline specific technical solutions based on these preferred technologies.
   - Document the components, systems, and integrations explicitly involved.

3. Acceptance Criteria
   - Clearly and explicitly define what constitutes successful completion of each task or feature.
   - Describe user-visible outcomes, technical benchmarks, or system behaviors explicitly.

4. Dependencies & Considerations
   - Clearly state any explicit dependencies or assumptions required to execute this plan.
   - Note technical risks, constraints, or considerations explicitly.

5. Resource Requirements
   - Outline the personnel, tools, technologies, and budget needed for implementation.

Keep the plan focused, technical, and detailed, emphasizing clarity, actionable tasks, and precise acceptance criteria.
Format in professional Markdown with appropriate headings and styling.`;
                  break;
                  
                case 'README.md':
                  // README incorporates vision and plan
                  prompt = `Create a comprehensive README.md file for a project named "${projectName}".
                  
Project description: ${projectInfo.description}
License: ${projectInfo.license}

Use the following information provided by the project creator:
${brainDump}

${generatedContent['VISION.md'] ? `VISION.md document:\n${generatedContent['VISION.md']}\n` : ''}
${generatedContent['PLAN.md'] ? `PLAN.md document:\n${generatedContent['PLAN.md']}` : ''}

Create a README that includes:
1. Project name and concise description
2. Features and capabilities (bullet points)
3. Installation instructions with code examples
4. Usage examples with code snippets
5. API documentation if applicable
6. License information
7. Contribution guidelines

Format in professional Markdown with appropriate headings, code blocks, and styling.`;
                  break;
                  
                case 'ARCHITECTURE.md':
                  // Architecture document should reflect technical aspects from the brain dump
                  prompt = `Create a technical ARCHITECTURE.md file for a project named "${projectName}".
                  
Use the following information provided by the project creator:
${brainDump}

${generatedContent['VISION.md'] ? `VISION.md document:\n${generatedContent['VISION.md']}\n` : ''}
${generatedContent['PLAN.md'] ? `PLAN.md document:\n${generatedContent['PLAN.md']}` : ''}

Create a comprehensive architecture document that aligns with our technology preferences:

1. System Overview
   - Describe the overall architecture approach (microservices, monolith, serverless)
   - Prefer well-established patterns like hexagonal architecture, clean architecture, or MVC

2. Technology Stack
   - Focus primarily on these preferred technologies:
     - Languages: TypeScript, JavaScript, Go, Rust
     - Frontend: Next.js, React, Tailwind CSS
     - Backend: Fastify, Express, Go standard library
     - Infrastructure: Docker, Kubernetes, AWS/GCP/Azure
     - AI Integration: OpenAI, Anthropic Claude, Google Gemini

3. Components & Services
   - Detail the key system components and their responsibilities
   - Clearly define service boundaries and communication patterns

4. Data Architecture
   - Document data models, storage solutions, and access patterns
   - Consider data flow, persistence, and caching strategies

5. APIs & Interfaces
   - Define API contracts and standards (REST, GraphQL, RPC)
   - Document authentication and authorization mechanisms

6. Security Considerations
   - Outline the security model and threat mitigations
   - Include data protection and privacy measures

7. Scalability & Performance
   - Document scaling strategy and performance optimizations
   - Include monitoring and observability considerations

Format in professional Markdown with appropriate headings and styling.`;
                  break;
                  
                case 'AESTHETIC.md':
                  // Aesthetic guide should focus on visual and design elements
                  prompt = `Create a comprehensive AESTHETIC.md style guide for a project named "${projectName}".
                  
Use the following information provided by the project creator:
${brainDump}

Create a detailed style guide aligned with modern web design best practices:

1. Design Principles
   - Focus on clean, minimalist, and functional design
   - Emphasize accessibility and inclusive design principles
   - Prioritize mobile-first, responsive design approach

2. Color System
   - Provide a modern, accessible color palette with hex codes
   - Include primary, secondary, accent, and neutral colors
   - Define semantic colors (success, warning, error, info)
   - Ensure all color combinations meet WCAG AA accessibility standards

3. Typography
   - Prefer system fonts or well-established web fonts like Inter, Roboto, or SF Pro
   - Define a clear type scale with specific sizes and weights
   - Include heading and body text styles with line heights

4. Component Library
   - Align with Tailwind CSS design patterns when applicable
   - Define core UI components (buttons, forms, cards, navigation)
   - Include component variants and states

5. Layout System
   - Define spacing scale and grid system
   - Include responsive breakpoints
   - Document layout patterns and best practices

6. Voice & Tone
   - Define content principles and writing style
   - Include examples of effective UI copy

Format in professional Markdown with appropriate headings and styling.`;
                  break;
                  
                case 'CHECKLIST.md':
                  // Checklist should be derived from the PLAN.md
                  prompt = `Create a comprehensive CHECKLIST.md file for a project named "${projectName}".
                  
Use the following information:
${brainDump}

${generatedContent['PLAN.md'] ? `PLAN.md document:\n${generatedContent['PLAN.md']}` : ''}

Create a detailed checklist document that includes:
1. Pre-development checklist
2. Development phase checklist
3. Testing and QA checklist
4. Pre-launch checklist
5. Launch checklist
6. Post-launch checklist

Format all items as checkbox markdown items (- [ ] Task) grouped in the appropriate sections.`;
                  break;
                  
                case 'TODO.md':
                  // TODO list should be derived from the PLAN.md
                  prompt = `Create a practical TODO.md file for a project named "${projectName}".
                  
Use the following information:
${generatedContent['PLAN.md'] ? `PLAN.md document:\n${generatedContent['PLAN.md']}` : ''}

Create a prioritized TODO list with:
1. High priority tasks (from the plan's immediate goals)
2. Medium priority tasks (from medium-term goals)
3. Low priority tasks (from stretch goals or nice-to-haves)
4. Backlog items (possible future enhancements)

Format all items as checkbox markdown items (- [ ] Task) grouped by priority.`;
                  break;
                  
                case 'BUG.md':
                  // BUG.md should be a template for reporting bugs
                  prompt = `Create a BUG.md template file for a project named "${projectName}".
                  
Create a bug tracking template that includes:
1. Introduction explaining the purpose of the document
2. Bug report template with sections for:
   - Bug description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Severity/priority
3. Guidelines for reporting bugs
4. Bug prioritization criteria
5. Sample placeholder for known issues (empty to start)

Format in professional Markdown with appropriate headings and styling.`;
                  break;
                  
                case 'DEVREF.md':
                  // DEVREF.md should be our standard strongly opinionated document
                  prompt = template.promptGenerator(projectName);
                  break;
                  
                default:
                  // Default prompt for any other document
                  prompt = template.promptGenerator(projectName);
              }
              
              // Generate content
              content = await this.contentGenerator.generateContent(prompt);
              
              // Store generated content for use in subsequent documents
              if (content) {
                generatedContent[fileName] = content;
              }
            } catch (error) {
              console.error(`Error generating content for ${fileName}:`, error);
              content = null;
            }
          }
          
          // Fall back to default content if generation failed
          if (!content) {
            content = template.defaultContent;
          }
          
          // Write the file
          if (this.fileService.writeFile(filePath, content)) {
            console.log(`✅ Created ${fileName}${content === template.defaultContent ? ' (using template)' : ' (AI-generated)'}`);
            createdCount++;
          }
        } else {
          console.log(`ℹ️  Skipped ${fileName} (already exists)`);
        }
      }
    } else {
      // If no brain dump is available, fall back to the old method
      for (const fileName of Object.keys(this.templates)) {
        const template = this.templates[fileName];
        const filePath = this.fileService.resolvePath(dirPath, fileName);
        
        // Only create file if it doesn't already exist
        if (!this.fileService.exists(filePath)) {
          let content: string | null = null;
          
          // Try to generate with AI if available
          if (this.contentGenerator?.isAvailable()) {
            try {
              content = await this.contentGenerator.generateContent(template.promptGenerator(basicProjectInfo.name));
            } catch (error) {
              console.error(`Error generating content for ${fileName}:`, error);
              content = null;
            }
          }
          
          // Fall back to default content if AI generation failed
          if (!content) {
            content = template.defaultContent;
          }
          
          // Write the file
          if (this.fileService.writeFile(filePath, content)) {
            console.log(`✅ Created ${fileName}${content === template.defaultContent ? ' (using template)' : ' (AI-generated)'}`);
            createdCount++;
          }
        } else {
          console.log(`ℹ️  Skipped ${fileName} (already exists)`);
        }
      }
    }
    
    return createdCount;
  }
}