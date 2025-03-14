package template

import (
	"fmt"
	"os"
	"path/filepath"
)

// TemplateService coordinates template-related operations
type TemplateService struct {
	Generator *FileGenerator
}

// NewService creates a new template service
func NewService(templatesDir string) *TemplateService {
	loader := NewLoader(templatesDir)
	engine := NewEngine(loader)
	generator := NewGenerator(engine)
	
	return &TemplateService{
		Generator: generator,
	}
}

// GenerateProjectFiles generates all project files from templates
func (s *TemplateService) GenerateProjectFiles(projectPath string, data interface{}) error {
	// Define template mapping for default files
	templateMap := map[string]string{
		"README.md":        filepath.Join(projectPath, "README.md"),
		"PLAN.md":          filepath.Join(projectPath, "PLAN.md"),
		"DEVREF.md":        filepath.Join(projectPath, "DEVREF.md"),
		"AESTHETIC.md":     filepath.Join(projectPath, "AESTHETIC.md"),
		"ARCHITECTURE.md":  filepath.Join(projectPath, "ARCHITECTURE.md"),
		"CHECKLIST.md":     filepath.Join(projectPath, "CHECKLIST.md"),
		"CLAUDE.md":        filepath.Join(projectPath, "CLAUDE.md"),
	}
	
	// Generate files from templates
	for templateName, outputPath := range templateMap {
		fmt.Printf("Generating %s...\n", filepath.Base(outputPath))
		if err := s.Generator.GenerateFile(templateName, outputPath, data); err != nil {
			// If the template doesn't exist, create an empty file
			if os.IsNotExist(err) {
				fmt.Printf("Template %s not found, creating empty file\n", templateName)
				if err := os.WriteFile(outputPath, []byte(""), 0644); err != nil {
					return fmt.Errorf("error creating empty file: %v", err)
				}
				continue
			}
			return fmt.Errorf("error generating file from template '%s': %v", templateName, err)
		}
	}
	
	return nil
}