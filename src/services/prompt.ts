import inquirer from 'inquirer';
import { FileTemplateMap, ProjectInfo } from '../types';

/**
 * Service for handling interactive prompts and gathering user input.
 */
export class PromptService {
  /**
   * Prompts the user for basic project information.
   * @returns A promise that resolves to the basic project info.
   */
  async promptForBasicInfo(): Promise<ProjectInfo> {
    console.log('🚀 Welcome to Blueprint');
    console.log('Please provide some basic information about your project.\n');
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: process.cwd().split('/').pop() || 'my-project',
      },
      {
        type: 'list',
        name: 'license',
        message: 'License:',
        choices: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'Proprietary', 'Other'],
        default: 'MIT',
      }
    ]);
    
    // Gather detailed brain dump
    console.log('\n📝 Please provide a brain dump of your project vision, goals, and details.');
    console.log('Think of this as a stream of consciousness about what you\'re building.');
    console.log('The more details you provide, the better your documentation will be.\n');
    
    const brainDump = await inquirer.prompt([
      {
        type: 'editor',
        name: 'brainDump',
        message: 'Project brain dump (your text editor will open):',
      }
    ]);
    
    // Extract a short description from brain dump if possible (first line or sentence)
    let shortDescription = 'A new software project.';
    const brainDumpText = brainDump.brainDump?.trim() || '';
    
    if (brainDumpText) {
      // Try to get first sentence or first line for description
      const firstLine = brainDumpText.split('\n')[0]?.trim();
      if (firstLine && firstLine.length <= 100) {
        shortDescription = firstLine;
      } else {
        // Try to get first sentence
        const firstSentence = brainDumpText.match(/^.+?[.!?](?:\s|$)/)?.[0]?.trim();
        if (firstSentence && firstSentence.length <= 100) {
          shortDescription = firstSentence;
        }
      }
    }
    
    return {
      name: answers.name,
      description: shortDescription,
      author: '',
      license: answers.license || 'MIT',
      sections: {
        // Store the brain dump as the core input for document generation
        '_brainDump': {
          'content': brainDumpText
        }
      },
    };
  }
  
  /**
   * Confirms with the user before generating documentation.
   * @returns A promise that resolves to a boolean indicating whether to proceed.
   */
  async confirmGeneration(): Promise<boolean> {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Generate all documentation files?',
        default: true,
      }
    ]);
    
    return answer.proceed;
  }
}