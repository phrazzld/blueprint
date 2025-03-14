package template

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

// TemplateLoader is responsible for loading template files
type TemplateLoader struct {
	TemplatesDir string
}

// NewLoader creates a new template loader
func NewLoader(templatesDir string) *TemplateLoader {
	return &TemplateLoader{
		TemplatesDir: templatesDir,
	}
}

// LoadTemplate loads the content of a template file
func (l *TemplateLoader) LoadTemplate(name string) (string, error) {
	path := filepath.Join(l.TemplatesDir, name)
	
	// Check if the template file exists
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return "", fmt.Errorf("template file not found: %s", name)
	}
	
	// Open the template file
	file, err := os.Open(path)
	if err != nil {
		return "", fmt.Errorf("error opening template file: %v", err)
	}
	defer file.Close()
	
	// Read the template content
	content, err := io.ReadAll(file)
	if err != nil {
		return "", fmt.Errorf("error reading template file: %v", err)
	}
	
	return string(content), nil
}