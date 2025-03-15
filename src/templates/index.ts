import { FileTemplateMap } from '../types';

/**
 * Claude command template for ticket-the-plan.md
 */
const TICKET_THE_PLAN_CONTENT = `## 1. Carefully Analyze PLAN.md
- **Think hard** and thoroughly review the provided \`PLAN.md\`.
- Explicitly identify:
  - Core features clearly stated.
  - Dependencies explicitly defined or implied.
  - Acceptance criteria clearly documented.
  - Any implicit requirements or assumptions needing clarification.

## 2. Structure the TODO.md
- Create or update \`TODO.md\` explicitly in this structured format:

\`\`\`markdown
# TODO

## [Feature/Section Name from PLAN.md]

- [ ] Task title (atomic and clear)
  - Explicit Description: Concise, actionable details.
  - Dependencies: Clearly stated (tasks or external requirements).
  - Priority: Explicitly defined (high, medium, low).

Repeat explicitly for each distinct task.
\`\`\`

- Ensure every task is explicitly atomic (each can be implemented, tested, and verified independently).

## 2. Explicitly Prioritize Tasks
- Think carefully about the optimal sequence:
  - Clearly order tasks by priority (high-priority tasks first).
  - Explicitly highlight and resolve dependencies clearly within task ordering.

## 3. Clarify and Document
- If uncertainty or ambiguity arises during task decomposition, explicitly note this clearly and request clarification.
- Document all assumptions explicitly made during ticketing clearly at the top of \`TODO.md\`.

## 4. Verify and Summarize
- Explicitly cross-reference each task with \`PLAN.md\` to ensure comprehensive coverage.
- Clearly summarize the total number of tasks and their priority distribution at the bottom of \`TODO.md\`.

## Example of Ticketed Task

\`\`\`markdown
- [ ] Implement user authentication
  - Explicit Description: Implement Google OAuth login flow, including login and logout functionality, aligned with security standards in DEVREF.md.
  - Dependencies: None
  - Priority: High
\`\`\`

Explicitly follow this structured, reasoning-intensive process to ensure tasks are clearly defined, atomic, and actionable.`;

/**
 * Claude command template for clear-todos.md
 */
const CLEAR_TODOS_CONTENT = `Carefully read the TODO.md file and explicitly select the next highest-priority incomplete item. Clearly document the reason for your choice (priority, dependencies, risk, etc.).

Before implementing, explicitly create a structured implementation plan:
- Clearly summarize exactly what needs to be done.
- Explicitly outline your intended approach, considering:
  - Dependencies on other tasks or systems.
  - Side-effects and risks clearly identified.
  - Explicit references to relevant standards from DEVREF.md, AESTHETIC.md, ARCHITECTURE.md, CHECKLIST.md.

Think hard about the optimal implementation strategy and explicitly document your reasoning clearly in this implementation plan.

Then fully implement the solution exactly according to your plan:
- Explicitly adhere to all guidelines provided in DEVREF.md, AESTHETIC.md, ARCHITECTURE.md, CHECKLIST.md.
- Immediately verify all relevant builds, linting, and tests explicitly. Clearly document results.
- If verification fails, explicitly troubleshoot, clearly document your debugging steps, fix the issue, and verify again.

Upon successful verification:
- Explicitly mark the task as completed in TODO.md.
- Clearly document your commit message, explicitly summarizing the task and your chosen implementation strategy.

Repeat this structured process iteratively until no incomplete tasks remain in TODO.md.

If at any point uncertainty arises, explicitly pause and request clarification immediately.`;

/**
 * Claude command template for fix-the-bug.md
 */
const FIX_THE_BUG_CONTENT = `A bug report has been provided in BUG.md. Carefully perform the following steps explicitly:

1. **Triage and Hypothesis Formation**
   - **Think carefully** as you reproduce and verify the bug:
     - Explicitly document the Reproduction Steps.
     - Clearly state Expected vs. Actual behavior.
     - Identify and explicitly document the most likely components or code paths involved.
   - **Think hard** to form initial hypotheses about potential causes.
   - Explicitly note if user error seems highly probable, clearly explaining your reasoning.

2. **Structured Debugging**
   - **Thoughtfully choose** your most promising debugging steps (isolating variables, adding logs, unit tests, bisecting recent changes).
   - Explicitly document each debugging attempt clearly and chronologically:
     - **Think carefully** about each step before you perform it.
     - Explicitly state exactly what was tried, the precise outcome, and **carefully reason** about what each outcome reveals about the bug.
     - **Reflect thoroughly** on each outcome, updating your hypotheses explicitly based on new insights gained.

3. **Iterative Debugging Loop**
   - Continue explicitly iterating this debugging approach until the bug is definitively fixed:
     - **Think hard** about each new insight to refine your understanding further.
     - Confirm explicitly and clearly document when your fix resolves the issue.
     - Clearly summarize exactly what code or configuration change resolved the bug.

4. **Postmortem and Reflection**
   - After fixing the bug, **thoughtfully produce** a concise, structured postmortem that clearly includes:
     - Root cause explicitly summarized.
     - Timeline of debugging steps explicitly documented.
     - Clearly stated final resolution.
     - Explicit and thoughtful recommendations to prevent recurrence.
   - **Think carefully** as you commit all changes, explicitly documenting the resolution and referencing the postmortem.

Follow this explicitly structured process, thoughtfully leveraging deep reasoning at each step. Explicitly request clarification whenever uncertainty arises.`;

/**
 * Default template for DEVREF.md
 */
const DEVREF_CONTENT = `# Software Engineering Best Practices for Claude

Use this document as explicit guidelines for maintaining consistently robust, readable, and secure software. Reference regularly when committing code, writing tests, or designing features.

## Commits
- **Conventional Commits**: Strictly follow conventional commit formats:
  - \`feat:\` New feature
  - \`fix:\` Bug fix
  - \`docs:\` Documentation updates
  - \`refactor:\` Refactoring without functional changes
  - \`test:\` Adding or modifying tests
  - \`chore:\` Maintenance or tooling changes
- **Atomic Commits**: Every commit must encapsulate exactly one logical, clearly defined change.

## Logging & Observability
- Implement structured logging in JSON format consistently across environments.
- Always include useful context in logs (timestamps, user IDs, error types).
- Incorporate correlation IDs for tracing requests through distributed systems.
- Instrument clear metrics for monitoring user and system performance.

## Testing
- Maintain high test coverage:
  - Unit tests: Test individual functions/methods thoroughly.
  - Integration tests: Verify interactions between components/services.
  - End-to-End (E2E) tests: Validate full system workflows from user perspective.
- Adopt Test-Driven Development (TDD) strictly unless explicitly stated otherwise.
- Ensure tests are fast, repeatable, and deterministic.
- Confirm all tests pass before commits and merges.

## Documentation
- Explicitly document critical architecture and design decisions within the codebase (markdown).
- Clearly document API endpoints using OpenAPI/Swagger.
- Include concise, practical setup instructions for local development.
- Keep documentation current; update immediately following code changes.

## Architecture & Design
- Clearly separate infrastructure, business logic, and interface layers (Hexagonal Architecture).
- Always define explicit API contracts.
- Implement modular, loosely coupled components that are easy to maintain.
- Handle all errors explicitly, providing clear and actionable error messages.
- Design resilient systems: use retries, graceful degradation, and circuit breakers when appropriate.

## Iterative Development
- Commit small, incremental, deployable changes frequently.
- Ensure each incremental change is fully tested and stable before progressing.
- Prioritize quick feedback and incremental validation of assumptions.

## Automation & CI/CD
- Ensure build, test, deployment, and database migration processes are fully automated and reproducible.
- Maintain robust CI/CD pipelines—never commit code that breaks these pipelines.
- Standardize and containerize development environments (Docker).
- Explicitly manage infrastructure through Infrastructure-as-Code (IaC).

## Security Practices
- Always assume inputs are untrusted; rigorously validate and sanitize.
- Regularly update dependencies and explicitly address vulnerabilities identified by security scans.
- Adhere strictly to least-privilege access principles.
- Encrypt sensitive data both in transit (HTTPS/TLS) and at rest.

## Performance & Scalability
- Regularly verify performance benchmarks and optimize where necessary.
- Monitor and explicitly log performance metrics.
- Design for resilience, implement retries, rate limiting, caching, and avoid single points of failure.
- Include stress and load testing regularly in the development cycle.

## Handling Technical Debt
- Identify and explicitly tag technical debt in comments (\`// TECH DEBT:\`).
- Prioritize reducing technical debt incrementally alongside feature development.

---

Always strictly adhere to this reference guide to ensure code consistency, maintainability, and quality. Explicitly reference this document when making decisions about implementation details, testing strategies, logging, or architecture. If uncertainty arises, request clarification rather than assuming or deviating from these standards.
`;

/**
 * Default template for AESTHETIC.md
 */
const AESTHETIC_CONTENT = `# Aesthetic Guide

## Overview
This document defines the aesthetic principles and design language for this project.

## Design Principles
- 
- 
- 

## Color Palette
- Primary: 
- Secondary: 
- Accent: 
- Background: 
- Text: 

## Typography
- Headings: 
- Body: 
- Code: 

## Components
- 
- 
- 

## Layout
- 
- 
- 

## Animations & Transitions
- 
- 
- 
`;

/**
 * Default template for ARCHITECTURE.md
 */
const ARCHITECTURE_CONTENT = `# Architecture

## Overview
This document outlines the architectural design of the project.

## System Design
- 
- 
- 

## Components
- 
- 
- 

## Data Flow
- 
- 
- 

## Dependencies
- 
- 
- 

## Security Considerations
- 
- 
- 

## Scalability
- 
- 
- 
`;

/**
 * Default template for CHECKLIST.md
 */
const CHECKLIST_CONTENT = `# Project Checklist

## Pre-Launch
- [ ] Code review completed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Performance benchmarks passing
- [ ] Security review completed
- [ ] Accessibility review completed

## Launch
- [ ] Deployment pipeline configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Rollback procedure documented
- [ ] Support team briefed

## Post-Launch
- [ ] Monitor for issues
- [ ] Collect user feedback
- [ ] Address critical bugs
- [ ] Review performance metrics
- [ ] Plan for improvements
`;

/**
 * Default template for PLAN.md
 */
const PLAN_CONTENT = `# Project Plan

## Objectives
- 
- 
- 

## Timeline
- Phase 1:
- Phase 2:
- Phase 3:

## Milestones
- 
- 
- 

## Resources
- 
- 
- 

## Risks & Mitigations
- 
- 
- 

## Success Metrics
- 
- 
- 
`;

/**
 * Default template for TODO.md
 */
const TODO_CONTENT = `# To-Do Items

## High Priority
- [ ] 
- [ ] 
- [ ] 

## Medium Priority
- [ ] 
- [ ] 
- [ ] 

## Low Priority
- [ ] 
- [ ] 
- [ ] 

## Backlog
- [ ] 
- [ ] 
- [ ] 
`;

/**
 * Default template for README.md
 */
const README_CONTENT = `# Project Name

## Overview
Brief description of the project.

## Features
- 
- 
- 

## Installation
\`\`\`bash
# Installation command
\`\`\`

## Usage
\`\`\`bash
# Usage example
\`\`\`

## Development
\`\`\`bash
# Development setup
\`\`\`

## License
`;

/**
 * Default template for BUG.md
 */
const BUG_CONTENT = `# Bug Tracking

## Active Issues
- [ ] 
- [ ] 
- [ ] 

## Resolved Issues
- [x] 
- [x] 
- [x] 

## Reporting a Bug
1. 
2. 
3. 

## Debugging Tips
- 
- 
- 
`;

/**
 * Default template for VISION.md
 */
const VISION_CONTENT = `# Vision

## Project Vision
A clear, concise statement of the project's long-term vision and purpose.

## Mission Statement
What the project aims to accomplish and why it matters.

## Core Values
- 
- 
- 

## Target Audience
- Primary: 
- Secondary: 

## Success Criteria
- 
- 
- 

## Strategic Goals
- Short term (3-6 months):
- Medium term (6-12 months):
- Long term (1-3 years):

## Differentiation
What makes this project unique compared to alternatives.
`;

/**
 * Map of file templates used for generating project documentation
 */
export const templates: FileTemplateMap = {
  // Claude commands
  '.claude/commands/ticket-the-plan.md': {
    defaultContent: TICKET_THE_PLAN_CONTENT,
    description: 'Claude command for turning PLAN.md into tickets in TODO.md',
    promptGenerator: () => '' // No prompt needed since we're using static content
  },
  '.claude/commands/clear-todos.md': {
    defaultContent: CLEAR_TODOS_CONTENT,
    description: 'Claude command for implementing tasks from TODO.md',
    promptGenerator: () => '' // No prompt needed since we're using static content
  },
  '.claude/commands/fix-the-bug.md': {
    defaultContent: FIX_THE_BUG_CONTENT,
    description: 'Claude command for debugging and fixing issues from BUG.md',
    promptGenerator: () => '' // No prompt needed since we're using static content
  },
  
  // Project documentation
  'DEVREF.md': {
    defaultContent: DEVREF_CONTENT,
    description: 'Developer reference guide and best practices',
    promptGenerator: (projectName: string) => `Create a comprehensive DEVREF.md file for a project named "${projectName}".

Create an opinionated developer reference guide focused on our preferred technologies and practices:

1. Technology Stack & Standards
   - Primary languages: TypeScript/JavaScript, Go, Rust
   - Frameworks: Next.js, React, Fastify, Express
   - Styling: Tailwind CSS
   - AI integration: OpenAI, Anthropic Claude, Google Gemini APIs
   - Infrastructure: Docker, Kubernetes, cloud-native approaches

2. Code Style & Conventions
   - JavaScript/TypeScript: ESLint with Airbnb or StandardJS style
   - Go: Follow official Go style guide, use gofmt
   - Rust: Follow Rust API guidelines
   - Strong typing preference (TypeScript over JavaScript when possible)
   - Functional programming patterns where appropriate

3. Git Workflow
   - Conventional Commits (feat:, fix:, docs:, test:, refactor:, etc.)
   - Branch naming: feature/*, bugfix/*, release/*, etc.
   - Pull request review requirements and standards
   - Commit signing with GPG

4. Testing Standards
   - Unit testing with appropriate frameworks (Jest, testing-library, Go testing, Rust test)
   - Integration and E2E testing requirements
   - Test coverage expectations
   - Mocking best practices

5. CI/CD Pipeline
   - GitHub Actions for CI/CD
   - Required checks before merging
   - Deployment strategies and environments
   - Monitoring and observability integration

6. Security Practices
   - Dependency scanning and updating
   - Code scanning and SAST tools
   - Authentication and authorization best practices
   - Secrets management

7. Performance Considerations
   - Performance testing requirements
   - Optimization techniques for specific tech stacks
   - Profiling tools and methods

8. Documentation Standards
   - Code documentation requirements
   - API documentation standards
   - Architecture documentation updates

Format in professional Markdown with appropriate headings and styling.`
  },
  
  'AESTHETIC.md': {
    defaultContent: AESTHETIC_CONTENT,
    description: 'Design principles and style guide',
    promptGenerator: (projectName: string) => `Create a comprehensive AESTHETIC.md file for a project named "${projectName}".
          
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

Format in professional Markdown with appropriate headings and styling.`
  },
  
  'ARCHITECTURE.md': {
    defaultContent: ARCHITECTURE_CONTENT,
    description: 'System architecture and design',
    promptGenerator: (projectName: string) => `Create a comprehensive ARCHITECTURE.md file for a project named "${projectName}".

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

Format in professional Markdown with appropriate headings and styling.`
  },
  
  'CHECKLIST.md': {
    defaultContent: CHECKLIST_CONTENT,
    description: 'Pre/post launch tasks and verification checklist',
    promptGenerator: (projectName: string) => `Create a comprehensive CHECKLIST.md file for a project named "${projectName}".

The document should provide a detailed checklist for project phases and quality assurance.

Include these sections:
1. Introduction/Purpose
2. Pre-Development Checklist
3. Development Checklist (with code quality items)
4. Testing Checklist
5. Security Checklist
6. Pre-Launch Checklist
7. Launch Checklist
8. Post-Launch Checklist
9. Maintenance Checklist

Each item should be formatted as a checkbox list item (- [ ] Task description).
Format everything in proper markdown with headings, lists, and appropriate styling.`
  },
  
  'PLAN.md': {
    defaultContent: PLAN_CONTENT,
    description: 'Project planning document',
    promptGenerator: (projectName: string) => `Create a detailed PLAN.md file for a project named "${projectName}".

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
Format in professional Markdown with appropriate headings and styling.`
  },
  
  'TODO.md': {
    defaultContent: TODO_CONTENT,
    description: 'Task tracking and backlog',
    promptGenerator: (projectName: string) => `Create a comprehensive TODO.md file for a project named "${projectName}".

The document should track tasks, improvements, and future work items.

Include these sections:
1. Introduction (brief explanation of how to use this document)
2. High Priority Tasks
3. Medium Priority Tasks
4. Low Priority Tasks
5. Backlog
6. Completed Tasks (initially empty section)

Each task should be formatted as a checkbox list item with a clear, actionable description.
Format everything in proper markdown with headings, lists, and appropriate styling.`,
    
    enhancedPromptGenerator: (projectInfo, fileName) => {
      // Get objectives from PLAN.md if available
      const planObjectives = projectInfo.sections['PLAN.md']?.objectives || '';
      const planContent = projectInfo.sections['PLAN.md'] ? JSON.stringify(projectInfo.sections['PLAN.md']) : '';
      
      return `Create a comprehensive TODO.md file for a project named "${projectInfo.name}".

The project description is: ${projectInfo.description}

This TODO list should be based on the project plan information:
${planObjectives}
${planContent}

Include these sections:
1. Introduction (brief explanation of how to use this document)
2. High Priority Tasks (extract from the project plan)
3. Medium Priority Tasks (extract from the project plan)
4. Low Priority Tasks (extract from the project plan)
5. Backlog
6. Completed Tasks (initially empty section)

Each task should be formatted as a checkbox list item with a clear, actionable description.
Format everything in proper markdown with headings, lists, and appropriate styling.`;
    },
    
    renderTemplate: (projectInfo, fileName) => {
      // Get objectives from PLAN.md
      const planObjectives = projectInfo.sections['PLAN.md']?.objectives || '';
      const tasks = projectInfo.sections[fileName]?.tasks || planObjectives;
      
      // Extract tasks based on the input
      const lines = tasks.split('\n').filter(line => line.trim() !== '');
      
      // Try to categorize tasks
      const highPriority: string[] = [];
      const mediumPriority: string[] = [];
      const lowPriority: string[] = [];
      
      // Simple prioritization - first 3 tasks are high priority, next 3 medium, rest low
      for (let i = 0; i < lines.length; i++) {
        const task = lines[i].trim();
        if (!task) continue;
        
        // Convert to checkbox format if not already
        const formattedTask = task.startsWith('- [ ]') ? task : `- [ ] ${task}`;
        
        if (i < 3) {
          highPriority.push(formattedTask);
        } else if (i < 6) {
          mediumPriority.push(formattedTask);
        } else {
          lowPriority.push(formattedTask);
        }
      }
      
      // If we couldn't extract any tasks, use placeholders
      if (highPriority.length === 0) highPriority.push('- [ ] Task 1');
      if (mediumPriority.length === 0) mediumPriority.push('- [ ] Task 2');
      if (lowPriority.length === 0) lowPriority.push('- [ ] Task 3');
      
      return `# To-Do Items

## Introduction
This document tracks tasks, improvements, and future work items for ${projectInfo.name}.
Mark tasks as completed by changing \`[ ]\` to \`[x]\`.

## High Priority
${highPriority.join('\n')}

## Medium Priority
${mediumPriority.join('\n')}

## Low Priority
${lowPriority.join('\n')}

## Backlog
- [ ] Future task 1
- [ ] Future task 2

## Completed
<!-- Add completed tasks here -->
`;
    }
  },
  
  'README.md': {
    defaultContent: README_CONTENT,
    description: 'Project overview and documentation',
    promptGenerator: (projectName: string) => `Create a professional README.md file for a project named "${projectName}".

The document should provide a comprehensive overview of the project and getting started information.

Include these sections:
1. Project Title & Description
2. Features
3. Installation Instructions
4. Usage/Quick Start
5. Configuration
6. API Documentation (if applicable)
7. Contributing Guidelines
8. Testing
9. License Information
10. Contact/Support

Format everything in proper markdown with headings, code blocks for installation commands, lists, and appropriate styling.`,
    
    enhancedPromptGenerator: (projectInfo, fileName) => {
      const features = projectInfo.sections[fileName]?.features || '';
      
      return `Create a professional README.md file for a project named "${projectInfo.name}".
      
The project description is: ${projectInfo.description}
The license is: ${projectInfo.license}

User input about features and usage:
${features}

Include these sections:
1. Project Title & Description (use the provided name and description)
2. Features (extract from the user input)
3. Installation Instructions (extract from the user input if mentioned)
4. Usage/Quick Start (extract from the user input if mentioned)
5. Configuration
6. Contributing Guidelines
7. License Information (use the provided license)

Format everything in proper markdown with headings, code blocks for installation commands, lists, and appropriate styling.`;
    },
    
    renderTemplate: (projectInfo, fileName) => {
      const features = projectInfo.sections[fileName]?.features || '';
      
      // Extract features from the input
      const featureLines = features.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.trim());
      
      // Try to identify installation and usage instructions in the features text
      let installationContent = '';
      let usageContent = '';
      let featuresList = '';
      
      // Simple extraction logic - look for keywords
      featuresList = featureLines
        .filter(line => !line.toLowerCase().includes('install') && !line.toLowerCase().includes('usage:'))
        .map(line => `- ${line}`)
        .join('\n');
      
      if (featuresList.trim() === '') {
        featuresList = '- Feature 1\n- Feature 2\n- Feature 3';
      }
      
      // Look for installation instructions
      const installLines = featureLines.filter(line => 
        line.toLowerCase().includes('install') || 
        line.toLowerCase().includes('setup')
      );
      
      if (installLines.length > 0) {
        installationContent = '```bash\n' + installLines.join('\n') + '\n```';
      } else {
        installationContent = '```bash\n# Installation commands\n```';
      }
      
      // Look for usage examples
      const usageLines = featureLines.filter(line => 
        line.toLowerCase().includes('usage:') || 
        line.toLowerCase().includes('example:') ||
        line.toLowerCase().includes('using')
      );
      
      if (usageLines.length > 0) {
        usageContent = '```bash\n' + usageLines.join('\n') + '\n```';
      } else {
        usageContent = '```bash\n# Usage example\n```';
      }
      
      return `# ${projectInfo.name}

## Overview
${projectInfo.description}

## Features
${featuresList}

## Installation
${installationContent}

## Usage
${usageContent}

## Configuration
*Configuration details for your project.*

## Contributing
*Guidelines for contributing to the project.*

## License
${projectInfo.license}`;
    }
  },
  
  'BUG.md': {
    defaultContent: BUG_CONTENT,
    description: 'Bug tracking and reporting guidelines',
    promptGenerator: (projectName: string) => `Create a comprehensive BUG.md file for a project named "${projectName}".

The document should provide guidelines for bug tracking and reporting.

Include these sections:
1. Introduction/Purpose
2. Bug Report Template (with fields like description, steps to reproduce, expected vs actual behavior, etc.)
3. Current Known Issues (initially with placeholder items)
4. Bug Prioritization Guidelines
5. Bug Resolution Process
6. Testing & Verification Process
7. Reporting Security Vulnerabilities

Format everything in proper markdown with headings, lists, code blocks for examples, and appropriate styling.`
  },
  
  'VISION.md': {
    defaultContent: VISION_CONTENT,
    description: 'Project vision, mission, and strategic goals',
    promptGenerator: (projectName: string) => `Create a comprehensive VISION.md file for a project named "${projectName}".

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
Format in professional Markdown with appropriate headings and styling.`,
    
    enhancedPromptGenerator: (projectInfo, fileName) => {
      const vision = projectInfo.sections[fileName]?.vision || '';
      
      return `Create a comprehensive VISION.md file for a project named "${projectInfo.name}".

The project description is: ${projectInfo.description}

User input about vision and mission:
${vision}

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
    },
    
    renderTemplate: (projectInfo, fileName) => {
      const vision = projectInfo.sections[fileName]?.vision || '';
      
      // Extract vision, mission, values, and audience from input
      const lines = vision.split('\n').filter(line => line.trim() !== '');
      
      // Extract based on keywords
      let visionStatement = '';
      let missionStatement = '';
      let valuesList = '- Value 1\n- Value 2\n- Value 3';
      let audience = '- Primary: \n- Secondary: ';
      
      // Simple extraction - look for keywords
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes('vision') || lower.includes('goal')) {
          visionStatement = line.replace(/^.*?vision:?\s*/i, '').trim();
        } else if (lower.includes('mission') || lower.includes('purpose')) {
          missionStatement = line.replace(/^.*?mission:?\s*/i, '').trim();
        } else if (lower.includes('value') || lower.includes('principle')) {
          // Try to extract values list
          const valuesText = lines.join('\n');
          const valuesMatch = valuesText.match(/value[s]?:?(.*?)(?=mission|\n\n|$)/i);
          if (valuesMatch && valuesMatch[1]) {
            const items = valuesMatch[1].split('\n')
              .filter(item => item.trim() !== '')
              .map(item => `- ${item.trim().replace(/^-\s*/, '')}`);
            if (items.length > 0) {
              valuesList = items.join('\n');
            }
          }
        } else if (lower.includes('audience') || lower.includes('user')) {
          // Try to extract audience info
          const audienceText = lines.join('\n');
          const audienceMatch = audienceText.match(/audience:?(.*?)(?=value|\n\n|$)/i);
          if (audienceMatch && audienceMatch[1]) {
            audience = audienceMatch[1].trim();
          }
        }
      }
      
      // If we couldn't extract specific parts, use the whole text as vision
      if (!visionStatement && lines.length > 0) {
        visionStatement = lines[0];
      }
      
      if (!missionStatement && lines.length > 1) {
        missionStatement = lines[1];
      }
      
      return `# Vision

## Project Vision
${visionStatement || 'A clear, concise statement of the project\'s long-term vision and purpose.'}

## Mission Statement
${missionStatement || 'What the project aims to accomplish and why it matters.'}

## Core Values
${valuesList}

## Target Audience
${audience}

## Success Criteria
- Success criterion 1
- Success criterion 2
- Success criterion 3

## Strategic Goals
- Short term (3-6 months): 
- Medium term (6-12 months): 
- Long term (1-3 years): 

## Differentiation
What makes this project unique compared to alternatives.`;
    }
  }
};