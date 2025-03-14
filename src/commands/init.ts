import { Command } from 'commander';
import { DocumentationGenerator } from '../services/generator';
import { FileService } from '../services/file';
import { OpenAIGenerator } from '../services/openai';
import { templates } from '../templates';
import { createSampleEnvFile } from '../config';

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
    .action(async (options) => {
      try {
        // Determine the target directory
        const targetDir = options.dir || process.cwd();
        const fileService = new FileService();
        
        // Create sample .env file if it doesn't exist
        const envCreated = createSampleEnvFile(targetDir);
        if (envCreated) {
          console.log(`ℹ️  Created sample .env file. Edit it to enable AI-powered generation.`);
        }
        
        // Initialize services
        const contentGenerator = options.ai ? new OpenAIGenerator() : null;
        
        if (options.ai && !contentGenerator?.isAvailable()) {
          console.log('⚠️  OpenAI API key not found or invalid. Using template-based generation.');
          console.log('💡 To enable AI-powered generation, set the OPENAI_API_KEY in your .env file.');
        }
        
        const generator = new DocumentationGenerator(
          templates,
          fileService,
          contentGenerator
        );
        
        // Generate documentation files
        console.log(`🚀 Initializing project in ${targetDir}...`);
        const fileCount = await generator.generateDocumentation(targetDir);
        
        console.log(`\n📄 Generated ${fileCount} documentation files successfully.`);
        if (fileCount > 0) {
          console.log(`🎉 Your project documentation is ready!`);
        } else {
          console.log(`ℹ️  No new files were created. All documentation files already exist.`);
        }
      } catch (error) {
        console.error('❌ Error initializing project:', error);
        process.exit(1);
      }
    });
  
  return command;
}