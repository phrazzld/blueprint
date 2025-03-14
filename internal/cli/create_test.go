package cli

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	
	"github.com/phrazzld/blueprint/pkg/log"
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
	
	// Save the original logger and runPrompts function and restore them later
	originalLogger := logger
	originalRunPrompts := runPrompts
	defer func() { 
		logger = originalLogger
		runPrompts = originalRunPrompts 
	}()
	
	// Create a dummy logger that doesn't output anything
	logger = log.NewLogger(log.ERROR)
	
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
	
	// Run the command with the OpenAI flag
	cmd := NewRootCmd()
	output, err := executeCommand(cmd, "create", "--name", testProjectName, "--path", testProjectPath, "--openai")
	
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