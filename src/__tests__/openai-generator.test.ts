import OpenAI from 'openai';
import { OpenAIGenerator } from '../services/openai';
import { config } from '../config';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    };
  });
});

// Mock console
console.log = jest.fn();
console.error = jest.fn();

describe('OpenAIGenerator', () => {
  let mockOpenAI: jest.Mock;
  
  beforeEach(() => {
    mockOpenAI = OpenAI as unknown as jest.Mock;
    jest.clearAllMocks();
  });
  
  describe('constructor', () => {
    it('should use the provided API key and model', () => {
      new OpenAIGenerator('test-api-key', 'test-model');
      
      expect(mockOpenAI).toHaveBeenCalledWith({ apiKey: 'test-api-key' });
    });
    
    it('should use the config values if none are provided', () => {
      // Save the original config
      const originalApiKey = config.openaiApiKey;
      const originalModel = config.openaiModel;
      
      // Set config values for the test
      config.openaiApiKey = 'config-api-key';
      config.openaiModel = 'config-model';
      
      new OpenAIGenerator();
      
      expect(mockOpenAI).toHaveBeenCalledWith({ apiKey: 'config-api-key' });
      
      // Restore original config
      config.openaiApiKey = originalApiKey;
      config.openaiModel = originalModel;
    });
    
    it('should set client to null if no API key is provided', () => {
      // Save the original config
      const originalApiKey = config.openaiApiKey;
      
      // Set config API key to undefined
      config.openaiApiKey = undefined;
      
      const generator = new OpenAIGenerator();
      
      expect(mockOpenAI).not.toHaveBeenCalled();
      expect(generator.isAvailable()).toBe(false);
      
      // Restore original config
      config.openaiApiKey = originalApiKey;
    });
    
    it('should handle errors during initialization', () => {
      // Set up the mock to throw an error
      mockOpenAI.mockImplementationOnce(() => {
        throw new Error('Init error');
      });
      
      const generator = new OpenAIGenerator('test-api-key');
      
      expect(console.error).toHaveBeenCalledWith(
        'Error initializing OpenAI client:',
        expect.any(Error)
      );
      expect(generator.isAvailable()).toBe(false);
    });
  });
  
  describe('isAvailable', () => {
    it('should return true if client is initialized', () => {
      const generator = new OpenAIGenerator('test-api-key');
      
      expect(generator.isAvailable()).toBe(true);
    });
    
    it('should return false if client is not initialized', () => {
      // Save the original config
      const originalApiKey = config.openaiApiKey;
      
      // Set config API key to undefined
      config.openaiApiKey = undefined;
      
      const generator = new OpenAIGenerator();
      
      expect(generator.isAvailable()).toBe(false);
      
      // Restore original config
      config.openaiApiKey = originalApiKey;
    });
  });
  
  describe('generateContent', () => {
    it('should generate content using OpenAI', async () => {
      // Set up the mock response
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Generated content'
            }
          }
        ]
      });
      
      mockOpenAI.mockImplementationOnce(() => {
        return {
          chat: {
            completions: {
              create: mockCreate
            }
          }
        };
      });
      
      const generator = new OpenAIGenerator('test-api-key', 'test-model');
      const content = await generator.generateContent('Test prompt');
      
      expect(content).toBe('Generated content');
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'test-model',
        messages: [
          {
            role: 'system',
            content: expect.any(String)
          },
          {
            role: 'user',
            content: 'Test prompt'
          }
        ],
        temperature: 0.7
      });
    });
    
    it('should return null if client is not available', async () => {
      // Save the original config
      const originalApiKey = config.openaiApiKey;
      
      // Set config API key to undefined
      config.openaiApiKey = undefined;
      
      const generator = new OpenAIGenerator();
      const content = await generator.generateContent('Test prompt');
      
      expect(content).toBeNull();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('OpenAI API key not found')
      );
      
      // Restore original config
      config.openaiApiKey = originalApiKey;
    });
    
    it('should handle errors during content generation', async () => {
      // Set up the mock to throw an error
      const mockCreate = jest.fn().mockRejectedValue(new Error('Generation error'));
      
      mockOpenAI.mockImplementationOnce(() => {
        return {
          chat: {
            completions: {
              create: mockCreate
            }
          }
        };
      });
      
      const generator = new OpenAIGenerator('test-api-key');
      const content = await generator.generateContent('Test prompt');
      
      expect(content).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error generating content with OpenAI:',
        expect.any(Error)
      );
    });
    
    it('should handle null content in the response', async () => {
      // Set up the mock response with null content
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: null
            }
          }
        ]
      });
      
      mockOpenAI.mockImplementationOnce(() => {
        return {
          chat: {
            completions: {
              create: mockCreate
            }
          }
        };
      });
      
      const generator = new OpenAIGenerator('test-api-key');
      const content = await generator.generateContent('Test prompt');
      
      expect(content).toBeNull();
    });
  });
});