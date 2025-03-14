package template

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/phrazzld/blueprint/internal/openai"
)

// TemplateService coordinates template-related operations
type TemplateService struct {
	Generator       *FileGenerator
	ContentGenerator *openai.ContentGenerator
	UseOpenAI       bool
}

// NewService creates a new template service
func NewService(templatesDir string, useOpenAI bool) *TemplateService {
	loader := NewLoader(templatesDir)
	engine := NewEngine(loader)
	generator := NewGenerator(engine)
	
	service := &TemplateService{
		Generator: generator,
		UseOpenAI: useOpenAI,
	}
	
	// Try to initialize OpenAI client if requested
	if useOpenAI {
		client, err := openai.NewClient()
		if err == nil {
			service.ContentGenerator = openai.NewContentGenerator(client)
		} else {
			fmt.Printf("Warning: OpenAI client initialization failed: %v\n", err)
			fmt.Println("Falling back to template-based generation.")
		}
	}
	
	return service
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
		fileName := filepath.Base(outputPath)
		fmt.Printf("Generating %s...\n", fileName)
		
		// Check if we should use OpenAI for this file
		if s.UseOpenAI && s.ContentGenerator != nil {
			var contentType openai.ContentType
			var useOpenAI bool
			
			switch fileName {
			case "PLAN.md":
				contentType = openai.ContentTypePlan
				useOpenAI = true
			case "AESTHETIC.md":
				contentType = openai.ContentTypeAesthetic
				useOpenAI = true
			case "ARCHITECTURE.md":
				contentType = openai.ContentTypeArchitecture
				useOpenAI = true
			}
			
			if useOpenAI {
				fmt.Printf("Using OpenAI to generate %s...\n", fileName)
				content, err := s.ContentGenerator.GenerateContent(contentType, data)
				if err != nil {
					fmt.Printf("Error generating content with OpenAI: %v\n", err)
					fmt.Println("Falling back to template-based generation.")
				} else {
					// Write the content to the output file
					if err := os.MkdirAll(filepath.Dir(outputPath), 0755); err != nil {
						return fmt.Errorf("error creating directory: %v", err)
					}
					
					if err := os.WriteFile(outputPath, []byte(content), 0644); err != nil {
						return fmt.Errorf("error writing file: %v", err)
					}
					
					// Skip template generation for this file
					continue
				}
			}
		}
		
		// Fall back to template generation
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