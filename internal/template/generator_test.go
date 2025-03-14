package template

import (
	"os"
	"path/filepath"
	"testing"
)

func TestFileGenerator(t *testing.T) {
	// Create a temporary directory for testing
	tempDir, err := os.MkdirTemp("", "blueprint-test")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)
	
	// Create a templates directory
	templatesDir := filepath.Join(tempDir, "templates")
	if err := os.Mkdir(templatesDir, 0755); err != nil {
		t.Fatalf("Failed to create templates directory: %v", err)
	}
	
	// Create a test template file
	templateName := "README.md"
	templateContent := "# {{.Name}}\n\n{{.Description}}"
	templatePath := filepath.Join(templatesDir, templateName)
	
	if err := os.WriteFile(templatePath, []byte(templateContent), 0644); err != nil {
		t.Fatalf("Failed to create test template file: %v", err)
	}
	
	// Create the output directory
	outputDir := filepath.Join(tempDir, "output")
	
	// Create a loader, engine, and generator
	loader := NewLoader(templatesDir)
	engine := NewEngine(loader)
	generator := NewGenerator(engine)
	
	// Test data for the template
	data := struct {
		Name        string
		Description string
	}{
		Name:        "Test Project",
		Description: "This is a test project",
	}
	
	// Generate a file
	outputPath := filepath.Join(outputDir, "README.md")
	err = generator.GenerateFile(templateName, outputPath, data)
	if err != nil {
		t.Errorf("Error generating file: %v", err)
	}
	
	// Verify the generated file
	content, err := os.ReadFile(outputPath)
	if err != nil {
		t.Errorf("Error reading generated file: %v", err)
	}
	
	expectedContent := "# Test Project\n\nThis is a test project"
	if string(content) != expectedContent {
		t.Errorf("Expected file content '%s', but got '%s'", expectedContent, string(content))
	}
	
	// Test generating multiple files
	templateMap := map[string]string{
		templateName: filepath.Join(outputDir, "docs", "README.md"),
	}
	
	// Generate files from the map
	err = generator.GenerateFromMap(templateMap, data)
	if err != nil {
		t.Errorf("Error generating files from map: %v", err)
	}
	
	// Verify the generated file in a subdirectory
	subDirPath := filepath.Join(outputDir, "docs", "README.md")
	content, err = os.ReadFile(subDirPath)
	if err != nil {
		t.Errorf("Error reading generated file in subdirectory: %v", err)
	}
	
	if string(content) != expectedContent {
		t.Errorf("Expected file content in subdirectory '%s', but got '%s'", expectedContent, string(content))
	}
}