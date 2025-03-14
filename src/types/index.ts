/**
 * Project configuration types
 */

/**
 * Represents configuration options for the Blueprint tool.
 */
export interface Config {
  /**
   * The OpenAI API key used for content generation.
   */
  openaiApiKey?: string;
  
  /**
   * The OpenAI model to use for content generation.
   */
  openaiModel: string;
}

/**
 * Template file options
 */

/**
 * Represents a file template for generating project documentation.
 */
export interface FileTemplate {
  /**
   * Default content to use when AI generation isn't available.
   */
  defaultContent: string;
  
  /**
   * The prompt to send to OpenAI for generating content.
   * This function takes a project name and returns a prompt string.
   */
  promptGenerator: (projectName: string) => string;
  
  /**
   * Description of what this file contains.
   */
  description: string;
}

/**
 * Map of file names to their templates.
 */
export type FileTemplateMap = Record<string, FileTemplate>;

/**
 * Content generation types
 */

/**
 * Interface for any content generator service.
 */
export interface ContentGenerator {
  /**
   * Generate content based on a prompt.
   * @param prompt The prompt to generate content from.
   * @returns A promise that resolves to the generated content or null if generation fails.
   */
  generateContent(prompt: string): Promise<string | null>;
}