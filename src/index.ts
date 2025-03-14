#!/usr/bin/env node

import { Command } from 'commander';
import { createInitCommand } from './commands/init';

/**
 * Main entry point for the Blueprint CLI tool.
 * Configures and runs the CLI commands.
 */
function main() {
  const program = new Command();
  
  // Configure the main program
  program
    .name('blueprint')
    .description('CLI tool for generating project documentation')
    .version('1.0.0');
  
  // Add commands
  program.addCommand(createInitCommand());
  
  // Parse command line arguments
  program.parse(process.argv);
  
  // Show help if no command provided
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

// Run the program
main();