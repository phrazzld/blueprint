package cli

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestCreateCommand(t *testing.T) {
	// Create a temporary directory for testing
	tempDir, err := os.MkdirTemp("", "blueprint-test")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	// Test with a specified path
	testProjectName := "test-project"
	testProjectPath := filepath.Join(tempDir, testProjectName)
	
	// Save the original runPrompts function and restore it later
	originalRunPrompts := runPrompts
	defer func() { runPrompts = originalRunPrompts }()
	
	// Mock the runPrompts function to avoid interactive prompts during testing
	runPrompts = func(initialConfig ProjectConfig) (ProjectConfig, error) {
		// Just return the initial config
		return initialConfig, nil
	}
	
	// Create a mock template directory for testing
	mockTemplateDir := filepath.Join(tempDir, "refs")
	err = os.MkdirAll(mockTemplateDir, 0755)
	if err != nil {
		t.Fatalf("Failed to create mock template directory: %v", err)
	}
	
	// Create mock template files
	mockTemplates := []string{"README.md", "PLAN.md", "DEVREF.md", "AESTHETIC.md", "ARCHITECTURE.md", "CHECKLIST.md", "CLAUDE.md"}
	for _, tmpl := range mockTemplates {
		err = os.WriteFile(filepath.Join(mockTemplateDir, tmpl), []byte("# {{.Name}}\n\nMock template for {{.Name}}"), 0644)
		if err != nil {
			t.Fatalf("Failed to create mock template file: %v", err)
		}
	}
	
	cmd := NewRootCmd()
	output, err := executeCommand(cmd, "create", "--name", testProjectName, "--path", testProjectPath)
	
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}
	
	// Check that the output mentions the project name and path
	if !strings.Contains(output, testProjectName) || !strings.Contains(output, testProjectPath) {
		t.Errorf("Expected output to contain project name and path, got: %s", output)
	}
	
	// Check that the directory was created
	if _, err := os.Stat(testProjectPath); os.IsNotExist(err) {
		t.Errorf("Expected project directory to be created at %s, but it doesn't exist", testProjectPath)
	}
}