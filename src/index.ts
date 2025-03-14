#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

// Hardcoded DEVREF.md content
const DEVREF_CONTENT = `# Development Reference

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
`;

// Create DEVREF.md file in the current directory
const createDevRefFile = () => {
  const currentDir = process.cwd();
  const filePath = path.join(currentDir, 'DEVREF.md');
  
  try {
    fs.writeFileSync(filePath, DEVREF_CONTENT);
    console.log(`✅ Created DEVREF.md in ${currentDir}`);
  } catch (error) {
    console.error('Error creating DEVREF.md:', error);
    process.exit(1);
  }
};

program
  .name('blueprint')
  .description('CLI tool for generating project documentation')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new project with basic documentation')
  .action(() => {
    createDevRefFile();
  });

program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}