import { DocumentationGenerator } from '../services/generator';
import { FileService } from '../services/file';
import { ContentGenerator, FileTemplateMap } from '../types';

// Mock the FileService
jest.mock('../services/file', () => {
  return {
    FileService: jest.fn().mockImplementation(() => {
      return {
        exists: jest.fn(),
        writeFile: jest.fn(),
        getBaseName: jest.fn(),
        resolvePath: jest.fn()
      };
    })
  };
});

// Mock ContentGenerator
class MockContentGenerator implements ContentGenerator {
  generateContent = jest.fn();
  isAvailable = jest.fn().mockReturnValue(true);
}

// Mock console
console.log = jest.fn();
console.error = jest.fn();

describe('DocumentationGenerator', () => {
  let fileService: jest.Mocked<FileService>;
  let contentGenerator: MockContentGenerator;
  let templates: FileTemplateMap;
  
  beforeEach(() => {
    // Set up the file service mock
    fileService = new FileService() as jest.Mocked<FileService>;
    fileService.getBaseName.mockReturnValue('test-project');
    fileService.resolvePath.mockImplementation((dir, file) => `${dir}/${file}`);
    
    // Set up the content generator mock
    contentGenerator = new MockContentGenerator();
    
    // Set up mock templates
    templates = {
      'test1.md': {
        defaultContent: 'Default content 1',
        promptGenerator: (name) => `Generate for ${name} 1`,
        description: 'Test file 1'
      },
      'test2.md': {
        defaultContent: 'Default content 2',
        promptGenerator: (name) => `Generate for ${name} 2`,
        description: 'Test file 2'
      }
    };
    
    jest.clearAllMocks();
  });
  
  describe('generateDocumentation', () => {
    it('should generate documentation for all templates', async () => {
      // Set up mocks to indicate files don't exist
      fileService.exists.mockReturnValue(false);
      fileService.writeFile.mockReturnValue(true);
      
      const generator = new DocumentationGenerator(templates, fileService);
      const result = await generator.generateDocumentation('/test/dir');
      
      // Check that files were created
      expect(result).toBe(2);
      expect(fileService.writeFile).toHaveBeenCalledTimes(2);
      expect(fileService.writeFile).toHaveBeenCalledWith('/test/dir/test1.md', 'Default content 1');
      expect(fileService.writeFile).toHaveBeenCalledWith('/test/dir/test2.md', 'Default content 2');
    });
    
    it('should skip existing files', async () => {
      // Set up mocks to indicate files exist
      fileService.exists.mockReturnValue(true);
      
      const generator = new DocumentationGenerator(templates, fileService);
      const result = await generator.generateDocumentation('/test/dir');
      
      // Check that no files were created
      expect(result).toBe(0);
      expect(fileService.writeFile).not.toHaveBeenCalled();
    });
    
    it('should use AI-generated content when available', async () => {
      // Set up mocks to indicate files don't exist
      fileService.exists.mockReturnValue(false);
      fileService.writeFile.mockReturnValue(true);
      
      // Set up content generator to return content
      contentGenerator.generateContent.mockResolvedValue('AI-generated content');
      
      const generator = new DocumentationGenerator(templates, fileService, contentGenerator);
      const result = await generator.generateDocumentation('/test/dir');
      
      // Check that files were created with AI content
      expect(result).toBe(2);
      expect(contentGenerator.generateContent).toHaveBeenCalledTimes(2);
      expect(contentGenerator.generateContent).toHaveBeenCalledWith('Generate for test-project 1');
      expect(contentGenerator.generateContent).toHaveBeenCalledWith('Generate for test-project 2');
      expect(fileService.writeFile).toHaveBeenCalledWith('/test/dir/test1.md', 'AI-generated content');
      expect(fileService.writeFile).toHaveBeenCalledWith('/test/dir/test2.md', 'AI-generated content');
    });
    
    it('should fall back to default content when AI generation fails', async () => {
      // Set up mocks to indicate files don't exist
      fileService.exists.mockReturnValue(false);
      fileService.writeFile.mockReturnValue(true);
      
      // Set up content generator to return null (generation failed)
      contentGenerator.generateContent.mockResolvedValue(null);
      
      const generator = new DocumentationGenerator(templates, fileService, contentGenerator);
      const result = await generator.generateDocumentation('/test/dir');
      
      // Check that files were created with default content
      expect(result).toBe(2);
      expect(contentGenerator.generateContent).toHaveBeenCalledTimes(2);
      expect(fileService.writeFile).toHaveBeenCalledWith('/test/dir/test1.md', 'Default content 1');
      expect(fileService.writeFile).toHaveBeenCalledWith('/test/dir/test2.md', 'Default content 2');
    });
    
    it('should handle errors during AI generation', async () => {
      // Set up mocks to indicate files don't exist
      fileService.exists.mockReturnValue(false);
      fileService.writeFile.mockReturnValue(true);
      
      // Set up content generator to throw an error
      contentGenerator.generateContent.mockImplementation(() => {
        throw new Error('Generation error');
      });
      
      const generator = new DocumentationGenerator(templates, fileService, contentGenerator);
      const result = await generator.generateDocumentation('/test/dir');
      
      // Check that files were created with default content
      expect(result).toBe(2);
      expect(contentGenerator.generateContent).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledTimes(2);
      expect(fileService.writeFile).toHaveBeenCalledWith('/test/dir/test1.md', 'Default content 1');
      expect(fileService.writeFile).toHaveBeenCalledWith('/test/dir/test2.md', 'Default content 2');
    });
    
    it('should count only successfully created files', async () => {
      // Set up mocks to indicate files don't exist
      fileService.exists.mockReturnValue(false);
      
      // First file succeeds, second file fails
      fileService.writeFile.mockImplementation((path) => {
        return path.includes('test1.md');
      });
      
      const generator = new DocumentationGenerator(templates, fileService);
      const result = await generator.generateDocumentation('/test/dir');
      
      // Check that only one file was counted
      expect(result).toBe(1);
    });
    
    it('should generate Claude command files in .claude/commands directory', async () => {
      // Set up mock templates with Claude command files
      const templatesWithClaudeCommands: FileTemplateMap = {
        ...templates,
        '.claude/commands/test-command.md': {
          defaultContent: 'Claude command content',
          promptGenerator: () => '',
          description: 'Test Claude command'
        }
      };
      
      // Set up mocks to indicate files don't exist
      fileService.exists.mockReturnValue(false);
      fileService.writeFile.mockReturnValue(true);
      
      const generator = new DocumentationGenerator(templatesWithClaudeCommands, fileService);
      const result = await generator.generateDocumentation('/test/dir');
      
      // Check that Claude command files were created
      expect(result).toBe(3); // 2 regular files + 1 Claude command file
      expect(fileService.writeFile).toHaveBeenCalledTimes(3);
      expect(fileService.writeFile).toHaveBeenCalledWith('/test/dir/.claude/commands/test-command.md', 'Claude command content');
      
      // Check that the resolvePath method was called with the correct arguments
      expect(fileService.resolvePath).toHaveBeenCalledWith('/test/dir', '.claude/commands/test-command.md');
    });
    
    it('should generate all three Claude command files from templates', async () => {
      // Import the actual templates to test against real content
      const { templates: actualTemplates } = require('../templates');
      
      // Create a test subset with only Claude command templates
      const claudeCommandTemplates: FileTemplateMap = {
        '.claude/commands/ticket-the-plan.md': actualTemplates['.claude/commands/ticket-the-plan.md'],
        '.claude/commands/clear-todos.md': actualTemplates['.claude/commands/clear-todos.md'],
        '.claude/commands/fix-the-bug.md': actualTemplates['.claude/commands/fix-the-bug.md']
      };
      
      // Set up mocks to indicate files don't exist
      fileService.exists.mockReturnValue(false);
      fileService.writeFile.mockReturnValue(true);
      
      const generator = new DocumentationGenerator(claudeCommandTemplates, fileService);
      const result = await generator.generateDocumentation('/test/dir');
      
      // Check that all three Claude command files were created
      expect(result).toBe(3);
      expect(fileService.writeFile).toHaveBeenCalledTimes(3);
      
      // Verify each file was created with the correct path and content
      expect(fileService.resolvePath).toHaveBeenCalledWith('/test/dir', '.claude/commands/ticket-the-plan.md');
      expect(fileService.resolvePath).toHaveBeenCalledWith('/test/dir', '.claude/commands/clear-todos.md');
      expect(fileService.resolvePath).toHaveBeenCalledWith('/test/dir', '.claude/commands/fix-the-bug.md');
      
      expect(fileService.writeFile).toHaveBeenCalledWith(
        '/test/dir/.claude/commands/ticket-the-plan.md', 
        claudeCommandTemplates['.claude/commands/ticket-the-plan.md'].defaultContent
      );
      expect(fileService.writeFile).toHaveBeenCalledWith(
        '/test/dir/.claude/commands/clear-todos.md', 
        claudeCommandTemplates['.claude/commands/clear-todos.md'].defaultContent
      );
      expect(fileService.writeFile).toHaveBeenCalledWith(
        '/test/dir/.claude/commands/fix-the-bug.md', 
        claudeCommandTemplates['.claude/commands/fix-the-bug.md'].defaultContent
      );
    });
    
    it('should generate Claude command files when using brain dump approach', async () => {
      // Import the actual templates to test against real content
      const { templates: actualTemplates } = require('../templates');
      
      // Include both regular templates and Claude command templates
      const mixedTemplates: FileTemplateMap = {
        'VISION.md': {
          defaultContent: 'Vision content',
          promptGenerator: (name) => `Generate Vision for ${name}`,
          description: 'Vision document'
        },
        '.claude/commands/ticket-the-plan.md': actualTemplates['.claude/commands/ticket-the-plan.md']
      };
      
      // Set up mocks to indicate files don't exist
      fileService.exists.mockReturnValue(false);
      fileService.writeFile.mockReturnValue(true);
      
      const generator = new DocumentationGenerator(mixedTemplates, fileService);
      
      // Create ProjectInfo mock with brain dump
      const projectInfo = {
        name: 'test-project',
        description: 'Test project',
        author: 'Test',
        license: 'MIT',
        sections: {
          _brainDump: {
            content: 'This is a brain dump'
          }
        }
      };
      
      const result = await generator.generateDocumentation('/test/dir', projectInfo);
      
      // Verify both regular and Claude command files were created
      expect(result).toBe(2);
      expect(fileService.writeFile).toHaveBeenCalledTimes(2);
      
      // Verify both file types were created
      expect(fileService.resolvePath).toHaveBeenCalledWith('/test/dir', 'VISION.md');
      expect(fileService.resolvePath).toHaveBeenCalledWith('/test/dir', '.claude/commands/ticket-the-plan.md');
    });
  });
});