package template

import (
	"os"
	"path/filepath"
	"testing"
)

func TestTemplateLoader(t *testing.T) {
	// Create a temporary directory for testing
	tempDir, err := os.MkdirTemp("", "blueprint-test")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)
	
	// Create a test template file
	templateName := "test.md"
	templateContent := "# Test Template\n\nHello, {{.Name}}!"
	templatePath := filepath.Join(tempDir, templateName)
	
	if err := os.WriteFile(templatePath, []byte(templateContent), 0644); err != nil {
		t.Fatalf("Failed to create test template file: %v", err)
	}
	
	// Create a loader
	loader := NewLoader(tempDir)
	
	// Test loading the template
	content, err := loader.LoadTemplate(templateName)
	if err != nil {
		t.Errorf("Error loading template: %v", err)
	}
	
	// Verify the loaded content
	if content != templateContent {
		t.Errorf("Expected template content '%s', but got '%s'", templateContent, content)
	}
	
	// Test loading a non-existent template
	_, err = loader.LoadTemplate("non-existent.md")
	if err == nil {
		t.Error("Expected error when loading non-existent template, but got none")
	}
}