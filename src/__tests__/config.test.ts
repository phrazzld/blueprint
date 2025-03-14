import * as fs from 'fs';
import * as path from 'path';
import { createSampleEnvFile } from '../config';

// Mock fs module
jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  existsSync: jest.fn()
}));

// Mock console
console.error = jest.fn();

describe('Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createSampleEnvFile', () => {
    it('should create a sample .env file if it does not exist', () => {
      // Set up the mock to indicate file does not exist
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const result = createSampleEnvFile('/test/dir');
      
      // Check that the file was created
      expect(result).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join('/test/dir', '.env'),
        expect.stringContaining('OPENAI_API_KEY')
      );
    });
    
    it('should not create a sample .env file if it already exists', () => {
      // Set up the mock to indicate file exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      const result = createSampleEnvFile('/test/dir');
      
      // Check that the file was not created
      expect(result).toBe(false);
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
    
    it('should handle errors when creating the file', () => {
      // Set up the mock to indicate file does not exist
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      // Set up writeFileSync to throw an error
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write error');
      });
      
      const result = createSampleEnvFile('/test/dir');
      
      // Check that the error was handled
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error creating .env file:',
        expect.any(Error)
      );
    });
  });
});