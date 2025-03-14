import { ContentGenerator, FileTemplateMap } from '../types';
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
   * @returns A promise that resolves to the generated file count.
   */
  async generateDocumentation(dirPath: string): Promise<number> {
    let createdCount = 0;
    const projectName = this.fileService.getBaseName(dirPath);
    
    // Process all template files
    for (const [fileName, template] of Object.entries(this.templates)) {
      const filePath = this.fileService.resolvePath(dirPath, fileName);
      
      // Only create file if it doesn't already exist
      if (!this.fileService.exists(filePath)) {
        let content: string | null = null;
        
        // Try to generate with AI if available
        if (this.contentGenerator) {
          try {
            console.log(`🤖 Generating ${fileName} with AI...`);
            const prompt = template.promptGenerator(projectName);
            content = await this.contentGenerator.generateContent(prompt);
          } catch (error) {
            console.error(`Error generating content for ${fileName}:`, error);
            content = null;
          }
        }
        
        // Fall back to default content if AI generation failed or not available
        if (!content) {
          content = template.defaultContent;
          console.log(`📄 Using template for ${fileName}`);
        } else {
          console.log(`✨ Using AI-generated content for ${fileName}`);
        }
        
        // Write the file
        if (this.fileService.writeFile(filePath, content)) {
          console.log(`✅ Created ${fileName}`);
          createdCount++;
        }
      } else {
        console.log(`ℹ️  ${fileName} already exists, skipping`);
      }
    }
    
    return createdCount;
  }
}