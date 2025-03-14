import OpenAI from 'openai';
import { ContentGenerator } from '../types';
import { config } from '../config';

/**
 * Service for generating content using OpenAI.
 * Implements the ContentGenerator interface.
 */
export class OpenAIGenerator implements ContentGenerator {
  private client: OpenAI | null;
  private model: string;
  
  /**
   * Creates a new OpenAIGenerator instance.
   * @param apiKey Optional API key. If not provided, it will use the one from config.
   * @param model Optional model name. If not provided, it will use the one from config.
   */
  constructor(apiKey?: string, model?: string) {
    this.model = model || config.openaiModel;
    const key = apiKey || config.openaiApiKey;
    
    if (!key) {
      this.client = null;
      return;
    }
    
    try {
      this.client = new OpenAI({ apiKey: key });
    } catch (error) {
      console.error('Error initializing OpenAI client:', error);
      this.client = null;
    }
  }
  
  /**
   * Checks if the OpenAI client is initialized.
   * @returns True if the client is initialized, false otherwise.
   */
  isAvailable(): boolean {
    return this.client !== null;
  }
  
  /**
   * Generates content using OpenAI.
   * @param prompt The prompt to send to OpenAI.
   * @returns The generated content, or null if generation fails.
   */
  async generateContent(prompt: string): Promise<string | null> {
    if (!this.client) {
      console.log('⚠️  OpenAI API key not found. Set OPENAI_API_KEY environment variable to use AI generation.');
      return null;
    }
    
    try {
      console.log('🤖 Generating content with OpenAI...');
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates project documentation. Respond with markdown content only, no explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });
      
      return response.choices[0].message.content || null;
    } catch (error) {
      console.error('Error generating content with OpenAI:', error);
      return null;
    }
  }
}