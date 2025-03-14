import dotenv from 'dotenv';
import { Config } from '../types';

/**
 * Loads environment variables from .env file
 */
dotenv.config();

/**
 * Default configuration for the application
 */
export const config: Config = {
  // Use the OpenAI API key from environment variables
  openaiApiKey: process.env.OPENAI_API_KEY,
  
  // Default OpenAI model to use
  openaiModel: 'gpt-4o'
};

/**
 * Creates a sample .env file if one doesn't exist in the current directory
 * @param dirPath The directory path to create the .env file in
 * @returns True if a new file was created, false if the file already existed
 */
export function createSampleEnvFile(dirPath: string): boolean {
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.join(dirPath, '.env');
  
  // Only create if the file doesn't already exist
  if (!fs.existsSync(envPath)) {
    const envContent = `# Environment Variables for Blueprint
# Uncomment and set the API key to enable AI-generated content
# OPENAI_API_KEY=your-api-key-here
`;
    
    try {
      fs.writeFileSync(envPath, envContent);
      return true;
    } catch (error) {
      console.error('Error creating .env file:', error);
      return false;
    }
  }
  
  return false;
}