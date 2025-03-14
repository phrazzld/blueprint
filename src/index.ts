#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

// Reference file templates
const FILE_TEMPLATES = {
  'DEVREF.md': `# Development Reference

## Overview
This document serves as a comprehensive reference for developers working on this project. It provides guidelines, best practices, and important information to ensure consistent and efficient development.

## Project Structure
- \`src/\`: Source code
- \`dist/\`: Compiled output
- \`tests/\`: Test files
- \`docs/\`: Documentation

## Development Workflow
1. Feature planning
2. Implementation
3. Testing
4. Code review
5. Merge to main branch

## Coding Standards
- Follow consistent naming conventions
- Write clean, modular, and testable code
- Comment complex logic
- Use TypeScript features effectively

## Version Control
- Use feature branches
- Write descriptive commit messages
- Squash commits before merging

## Testing
- Write unit tests for all new features
- Ensure all tests pass before submitting PR
- Aim for high test coverage

## Deployment
- CI/CD pipeline handles automatic deployment
- Staging environment mirrors production
- Use feature flags for gradual rollouts
`,
  'AESTHETIC.md': `# Aesthetic Guide

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
`,
  'ARCHITECTURE.md': `# Architecture

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
`,
  'CHECKLIST.md': `# Project Checklist

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
`,
  'PLAN.md': `# Project Plan

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
`,
  'TODO.md': `# To-Do Items

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
`,
  'README.md': `# Project Name

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
`,
  'BUG.md': `# Bug Tracking

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
`
};

// Create reference files in the current directory
const createReferenceFiles = () => {
  const currentDir = process.cwd();
  let createdCount = 0;
  
  for (const [fileName, content] of Object.entries(FILE_TEMPLATES)) {
    const filePath = path.join(currentDir, fileName);
    
    try {
      // Only create file if it doesn't already exist
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Created ${fileName}`);
        createdCount++;
      } else {
        console.log(`ℹ️  ${fileName} already exists, skipping`);
      }
    } catch (error) {
      console.error(`Error creating ${fileName}:`, error);
    }
  }
  
  console.log(`\n📄 ${createdCount} reference files created successfully`);
};

program
  .name('blueprint')
  .description('CLI tool for generating project documentation')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new project with reference documentation')
  .action(() => {
    createReferenceFiles();
  });

program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}