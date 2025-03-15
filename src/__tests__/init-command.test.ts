import { createInitCommand } from '../commands/init';
import { DocumentationGenerator } from '../services/generator';
import { FileService } from '../services/file';
import { OpenAIGenerator } from '../services/openai';
import { PromptService } from '../services/prompt';
import { templates } from '../templates';
import * as config from '../config';

// Mock required modules
jest.mock('../services/generator');
jest.mock('../services/file');
jest.mock('../services/openai');
jest.mock('../config');
jest.mock('../services/prompt');

// Mock process.exit and console
process.exit = jest.fn() as any;
console.log = jest.fn();
console.error = jest.fn();

describe('Init Command', () => {
  const MockDocumentationGenerator = DocumentationGenerator as jest.MockedClass<typeof DocumentationGenerator>;
  const MockFileService = FileService as jest.MockedClass<typeof FileService>;
  const MockOpenAIGenerator = OpenAIGenerator as jest.MockedClass<typeof OpenAIGenerator>;
  const MockPromptService = PromptService as jest.MockedClass<typeof PromptService>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock createSampleEnvFile
    (config.createSampleEnvFile as jest.Mock).mockReturnValue(true);
    
    // Mock generateDocumentation to return 5 (files created)
    MockDocumentationGenerator.prototype.generateDocumentation = jest.fn().mockResolvedValue(5);
    
    // Mock isAvailable to return true
    MockOpenAIGenerator.prototype.isAvailable = jest.fn().mockReturnValue(true);
    
    // Mock PromptService methods
    MockPromptService.prototype.promptForBasicInfo = jest.fn().mockResolvedValue({
      name: 'test-project',
      description: 'A test project',
      author: 'Test Author',
      license: 'MIT',
      sections: {
        '_brainDump': {
          'content': 'Test brain dump content'
        }
      }
    });
    MockPromptService.prototype.confirmGeneration = jest.fn().mockResolvedValue(true);
    
    // Mock process.cwd
    Object.defineProperty(process, 'cwd', {
      value: jest.fn().mockReturnValue('/test/dir')
    });
  });
  
  it('should initialize documentation with default options', async () => {
    const command = createInitCommand();
    
    // Simulate command execution
    await command.parseAsync(['node', 'script', 'init']);
    
    // Check that services were initialized correctly
    expect(MockFileService).toHaveBeenCalledTimes(1);
    expect(MockOpenAIGenerator).toHaveBeenCalledTimes(1);
    expect(MockDocumentationGenerator).toHaveBeenCalledTimes(1);
    expect(MockDocumentationGenerator).toHaveBeenCalledWith(
      templates,
      expect.any(FileService),
      expect.any(OpenAIGenerator)
    );
    
    // Check that documentation was generated
    expect(MockDocumentationGenerator.prototype.generateDocumentation).toHaveBeenCalledWith(
      '/test/dir',
      expect.objectContaining({
        name: 'test-project',
        description: 'A test project'
      })
    );
    
    // Check console output
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Initializing documentation'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Complete! Generated 5 files'));
  });
  
  it('should use custom directory when provided', async () => {
    const command = createInitCommand();
    
    // Simulate command execution with custom directory
    await command.parseAsync(['node', 'script', 'init', '--dir', '/custom/dir']);
    
    // Check that documentation was generated in the custom directory
    expect(MockDocumentationGenerator.prototype.generateDocumentation).toHaveBeenCalledWith(
      '/custom/dir',
      expect.objectContaining({
        name: 'test-project'
      })
    );
  });
  
  it('should disable AI when --no-ai flag is provided', async () => {
    const command = createInitCommand();
    
    // Simulate command execution with --no-ai flag
    await command.parseAsync(['node', 'script', 'init', '--no-ai']);
    
    // Check that OpenAI generator was not created
    expect(MockOpenAIGenerator).not.toHaveBeenCalled();
    expect(MockDocumentationGenerator).toHaveBeenCalledWith(
      templates,
      expect.any(FileService),
      null
    );
  });
  
  it('should warn when OpenAI is not available', async () => {
    // Mock isAvailable to return false
    MockOpenAIGenerator.prototype.isAvailable = jest.fn().mockReturnValue(false);
    
    const command = createInitCommand();
    
    // Simulate command execution
    await command.parseAsync(['node', 'script', 'init']);
    
    // Check that warning was logged
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('OpenAI API key not found or invalid'));
  });
  
  it('should handle errors during documentation generation', async () => {
    // Mock generateDocumentation to throw an error
    MockDocumentationGenerator.prototype.generateDocumentation = jest.fn().mockRejectedValue(new Error('Generation error'));
    
    const command = createInitCommand();
    
    // Simulate command execution
    await command.parseAsync(['node', 'script', 'init']);
    
    // Check that error was logged and process exit was called
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error initializing project'), expect.any(Error));
    expect(process.exit).toHaveBeenCalledWith(1);
  });
  
  it('should display info message when no files are created', async () => {
    // Mock generateDocumentation to return 0 (no files created)
    MockDocumentationGenerator.prototype.generateDocumentation = jest.fn().mockResolvedValue(0);
    
    const command = createInitCommand();
    
    // Simulate command execution
    await command.parseAsync(['node', 'script', 'init']);
    
    // Check that info message was logged
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No new files created'));
  });
  
  it('should use non-interactive mode when --no-interactive flag is provided', async () => {
    const command = createInitCommand();
    
    // Simulate command execution with --no-interactive flag
    await command.parseAsync(['node', 'script', 'init', '--no-interactive']);
    
    // Check that PromptService methods weren't called
    expect(MockPromptService.prototype.promptForBasicInfo).not.toHaveBeenCalled();
    expect(MockPromptService.prototype.confirmGeneration).not.toHaveBeenCalled();
    
    // Check that documentation was still generated
    expect(MockDocumentationGenerator.prototype.generateDocumentation).toHaveBeenCalledWith('/test/dir', undefined);
  });
  
  it('should initialize DocumentationGenerator with templates including Claude command files', async () => {
    const command = createInitCommand();
    
    // Simulate command execution
    await command.parseAsync(['node', 'script', 'init', '--no-interactive']);
    
    // Check that DocumentationGenerator was initialized with templates that include Claude command files
    expect(MockDocumentationGenerator).toHaveBeenCalledWith(
      expect.objectContaining({
        '.claude/commands/ticket-the-plan.md': expect.any(Object),
        '.claude/commands/clear-todos.md': expect.any(Object),
        '.claude/commands/fix-the-bug.md': expect.any(Object)
      }),
      expect.any(FileService),
      expect.any(OpenAIGenerator)
    );
  });
});