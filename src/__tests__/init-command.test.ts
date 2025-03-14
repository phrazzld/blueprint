import { createInitCommand } from '../commands/init';
import { DocumentationGenerator } from '../services/generator';
import { FileService } from '../services/file';
import { OpenAIGenerator } from '../services/openai';
import { templates } from '../templates';
import * as config from '../config';

// Mock required modules
jest.mock('../services/generator');
jest.mock('../services/file');
jest.mock('../services/openai');
jest.mock('../config');

// Mock process.exit and console
process.exit = jest.fn() as any;
console.log = jest.fn();
console.error = jest.fn();

describe('Init Command', () => {
  const MockDocumentationGenerator = DocumentationGenerator as jest.MockedClass<typeof DocumentationGenerator>;
  const MockFileService = FileService as jest.MockedClass<typeof FileService>;
  const MockOpenAIGenerator = OpenAIGenerator as jest.MockedClass<typeof OpenAIGenerator>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock createSampleEnvFile
    (config.createSampleEnvFile as jest.Mock).mockReturnValue(true);
    
    // Mock generateDocumentation to return 5 (files created)
    MockDocumentationGenerator.prototype.generateDocumentation = jest.fn().mockResolvedValue(5);
    
    // Mock isAvailable to return true
    MockOpenAIGenerator.prototype.isAvailable = jest.fn().mockReturnValue(true);
    
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
    expect(MockDocumentationGenerator.prototype.generateDocumentation).toHaveBeenCalledWith('/test/dir');
    
    // Check console output
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Initializing project'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Generated 5 documentation files'));
  });
  
  it('should use custom directory when provided', async () => {
    const command = createInitCommand();
    
    // Simulate command execution with custom directory
    await command.parseAsync(['node', 'script', 'init', '--dir', '/custom/dir']);
    
    // Check that documentation was generated in the custom directory
    expect(MockDocumentationGenerator.prototype.generateDocumentation).toHaveBeenCalledWith('/custom/dir');
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
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No new files were created'));
  });
});