package template

import (
	"fmt"
	"os"
	"path/filepath"
)

// FileGenerator is responsible for generating files from templates
type FileGenerator struct {
	Engine *TemplateEngine
}

// NewGenerator creates a new file generator
func NewGenerator(engine *TemplateEngine) *FileGenerator {
	return &FileGenerator{
		Engine: engine,
	}
}

// GenerateFile generates a file from a template
func (g *FileGenerator) GenerateFile(templateName, outputPath string, data interface{}) error {
	// Process the template
	content, err := g.Engine.ProcessTemplate(templateName, data)
	if err != nil {
		return fmt.Errorf("error processing template: %v", err)
	}
	
	// Ensure the directory exists
	dir := filepath.Dir(outputPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("error creating directory: %v", err)
	}
	
	// Write the content to the output file
	if err := os.WriteFile(outputPath, []byte(content), 0644); err != nil {
		return fmt.Errorf("error writing to file: %v", err)
	}
	
	return nil
}

// GenerateFromMap generates multiple files from a map of template names to output paths
func (g *FileGenerator) GenerateFromMap(templateMap map[string]string, data interface{}) error {
	for templateName, outputPath := range templateMap {
		if err := g.GenerateFile(templateName, outputPath, data); err != nil {
			return fmt.Errorf("error generating file from template '%s': %v", templateName, err)
		}
	}
	
	return nil
}