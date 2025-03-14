package cli

import (
	"bytes"
	"os"
	"testing"

	"github.com/spf13/cobra"
)

func executeCommand(root *cobra.Command, args ...string) (output string, err error) {
	// Create new buffers for command output
	stdout := new(bytes.Buffer)
	stderr := new(bytes.Buffer)
	
	// Save old stdout and stderr
	oldStdout := os.Stdout
	oldStderr := os.Stderr
	
	// Create pipe for capturing global output
	r, w, _ := os.Pipe()
	os.Stdout = w
	os.Stderr = w
	
	// Set command output and args
	root.SetOut(stdout)
	root.SetErr(stderr)
	root.SetArgs(args)
	
	// Execute the command
	err = root.Execute()
	
	// Restore original stdout and stderr
	w.Close()
	os.Stdout = oldStdout
	os.Stderr = oldStderr
	
	// Read the captured output
	var capturedOutput bytes.Buffer
	_, _ = capturedOutput.ReadFrom(r)
	
	// Combine all output
	output = stdout.String() + stderr.String() + capturedOutput.String()
	return output, err
}

func TestRootCommand(t *testing.T) {
	cmd := NewRootCmd()
	output, err := executeCommand(cmd)
	
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}
	
	// Check that help text is displayed
	if len(output) == 0 {
		t.Error("Expected help output, got empty string")
	}
}

func TestVersionCommand(t *testing.T) {
	cmd := NewRootCmd()
	output, err := executeCommand(cmd, "version")
	
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}
	
	expected := "Blueprint version 0.1.0\n"
	if output != expected {
		t.Errorf("Expected: %q, got: %q", expected, output)
	}
}