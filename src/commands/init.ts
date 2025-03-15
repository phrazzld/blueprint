import { Command } from 'commander';
import { DocumentationGenerator } from '../services/generator';
import { FileService } from '../services/file';
import { OpenAIGenerator } from '../services/openai';
import { PromptService } from '../services/prompt';
import { templates } from '../templates';
import { createSampleEnvFile } from '../config';
import { ProjectInfo } from '../types';

/**
 * Creates the init command for initializing a project with documentation files.
 * @returns The configured command.
 */
export function createInitCommand(): Command {
  const command = new Command('init');
  
  command
    .description('Initialize a new project with reference documentation')
    .option('-d, --dir <directory>', 'The directory to initialize (defaults to current directory)')
    .option('--no-ai', 'Disable AI-powered content generation even if API key is available')
    .option('--no-interactive', 'Disable interactive mode and use default templates')
    .action(async (options) => {
      try {
        // Determine the target directory
        const targetDir = options.dir || process.cwd();
        const fileService = new FileService();
        
        // Create sample .env file if it doesn't exist
        const envCreated = createSampleEnvFile(targetDir);
        if (envCreated) {
          console.log(`ℹ️  Created sample .env file`);
        }
        
        // Initialize services
        const contentGenerator = options.ai ? new OpenAIGenerator() : null;
        
        if (options.ai && contentGenerator && !contentGenerator.isAvailable()) {
          console.log('⚠️  OpenAI API key not found or invalid. Using templates instead. Set OPENAI_API_KEY in .env to enable AI generation.');
        }
        
        const generator = new DocumentationGenerator(
          templates,
          fileService,
          contentGenerator
        );
        
        // Interactive mode
        let projectInfo: ProjectInfo | undefined;
        
        if (options.interactive) {
          try {
            const promptService = new PromptService();
            
            // Gather basic project information
            projectInfo = await promptService.promptForBasicInfo();
            
            // Confirm before generating
            const proceed = await promptService.confirmGeneration();
            if (!proceed) {
              console.log('🛑 Documentation generation cancelled.');
              return;
            }
          } catch (error) {
            console.error('Error in interactive mode:', error);
            console.log('⚠️  Falling back to non-interactive mode.');
            projectInfo = undefined;
          }
        }
        
        // Generate documentation files
        console.log(`\n🚀 Initializing documentation in ${targetDir}...`);
        const fileCount = await generator.generateDocumentation(targetDir, projectInfo);
        
        if (fileCount > 0) {
          console.log(`\n✅ Complete! Generated ${fileCount} files.`);
        } else {
          console.log(`\nℹ️  No new files created. All files already exist.`);
        }
      } catch (error) {
        console.error('❌ Error initializing project:', error);
        process.exit(1);
      }
    });
  
  return command;
}