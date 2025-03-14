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
  });
});