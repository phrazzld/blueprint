import * as fs from 'fs';
import * as path from 'path';

/**
 * Service for file operations.
 */
export class FileService {
  /**
   * Checks if a file exists at the given path.
   * @param filePath The path to check.
   * @returns True if the file exists, false otherwise.
   */
  exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
  
  /**
   * Creates a file with the given content.
   * @param filePath The path to create the file at.
   * @param content The content to write to the file.
   * @returns True if the file was created successfully, false otherwise.
   */
  writeFile(filePath: string, content: string): boolean {
    try {
      // Create parent directories if they don't exist
      const dirPath = path.dirname(filePath);
      
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      return true;
    } catch (error) {
      console.error(`Error writing file ${filePath}:`, error);
      return false;
    }
  }
  
  /**
   * Gets the base name (folder name) from a path.
   * @param dirPath The path to get the base name from.
   * @returns The base name.
   */
  getBaseName(dirPath: string): string {
    return path.basename(dirPath);
  }
  
  /**
   * Gets the full path to a file in a directory.
   * @param dirPath The directory path.
   * @param fileName The file name.
   * @returns The full path.
   */
  resolvePath(dirPath: string, fileName: string): string {
    return path.join(dirPath, fileName);
  }
}