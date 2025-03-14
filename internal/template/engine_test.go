package template

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestTemplateEngine(t *testing.T) {
	// Create a temporary directory for testing
	tempDir, err := os.MkdirTemp("", "blueprint-test")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)
	
	// Create a test template file
	templateName := "test.md"
	templateContent := "# {{.Title}}\n\nHello, {{.Name}}!"
	templatePath := filepath.Join(tempDir, templateName)
	
	if err := os.WriteFile(templatePath, []byte(templateContent), 0644); err != nil {
		t.Fatalf("Failed to create test template file: %v", err)
	}
	
	// Create a loader and engine
	loader := NewLoader(tempDir)
	engine := NewEngine(loader)
	
	// Test data for the template
	data := struct {
		Title string
		Name  string
	}{
		Title: "Test Project",
		Name:  "John",
	}
	
	// Process the template
	result, err := engine.ProcessTemplate(templateName, data)
	if err != nil {
		t.Errorf("Error processing template: %v", err)
	}
	
	// Verify the processed content
	expected := "# Test Project\n\nHello, John!"
	if result != expected {
		t.Errorf("Expected processed template '%s', but got '%s'", expected, result)
	}
	
	// Test with invalid template
	invalidTemplateName := "invalid.md"
	invalidTemplateContent := "# {{.Title}\n\nInvalid template!"
	invalidTemplatePath := filepath.Join(tempDir, invalidTemplateName)
	
	if err := os.WriteFile(invalidTemplatePath, []byte(invalidTemplateContent), 0644); err != nil {
		t.Fatalf("Failed to create invalid template file: %v", err)
	}
	
	// Process the invalid template
	_, err = engine.ProcessTemplate(invalidTemplateName, data)
	if err == nil {
		t.Error("Expected error when processing invalid template, but got none")
	} else if !strings.Contains(err.Error(), "error parsing template") {
		t.Errorf("Expected parsing error, but got: %v", err)
	}
}