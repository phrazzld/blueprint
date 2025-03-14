import * as fs from 'fs';
import * as path from 'path';
import { FileService } from '../services/file';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn()
}));

// Mock console
console.error = jest.fn();

describe('FileService', () => {
  let fileService: FileService;
  
  beforeEach(() => {
    fileService = new FileService();
    jest.clearAllMocks();
  });
  
  describe('exists', () => {
    it('should return true if file exists', () => {
      // Set up the mock to indicate file exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      const result = fileService.exists('/test/file.txt');
      
      // Check that the result is correct
      expect(result).toBe(true);
      expect(fs.existsSync).toHaveBeenCalledWith('/test/file.txt');
    });
    
    it('should return false if file does not exist', () => {
      // Set up the mock to indicate file does not exist
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const result = fileService.exists('/test/file.txt');
      
      // Check that the result is correct
      expect(result).toBe(false);
      expect(fs.existsSync).toHaveBeenCalledWith('/test/file.txt');
    });
  });
  
  describe('writeFile', () => {
    it('should write a file and return true on success', () => {
      // Set up the mock to indicate directory exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      const result = fileService.writeFile('/test/file.txt', 'test content');
      
      // Check that the file was written
      expect(result).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalledWith('/test/file.txt', 'test content');
      expect(fs.mkdirSync).not.toHaveBeenCalled(); // Directory already exists
    });
    
    it('should create parent directories if they do not exist', () => {
      // Set up the mock to indicate directory does not exist
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const result = fileService.writeFile('/test/subdir/file.txt', 'test content');
      
      // Check that the directory was created and file was written
      expect(result).toBe(true);
      expect(fs.mkdirSync).toHaveBeenCalledWith('/test/subdir', { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith('/test/subdir/file.txt', 'test content');
    });
    
    it('should handle errors and return false', () => {
      // Set up the mock to indicate directory exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      // Set up writeFileSync to throw an error
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write error');
      });
      
      const result = fileService.writeFile('/test/file.txt', 'test content');
      
      // Check that the error was handled
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error writing file /test/file.txt:',
        expect.any(Error)
      );
    });
  });
  
  describe('getBaseName', () => {
    it('should return the base name of a path', () => {
      const result = fileService.getBaseName('/test/project');
      
      // Check that the result is correct
      expect(result).toBe('project');
    });
  });
  
  describe('resolvePath', () => {
    it('should join a directory and file name', () => {
      const result = fileService.resolvePath('/test', 'file.txt');
      
      // Check that the result is correct
      expect(result).toBe(path.join('/test', 'file.txt'));
    });
  });
});