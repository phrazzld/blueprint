package errors

import (
	"errors"
	"testing"
)

func TestAppError(t *testing.T) {
	// Create a cause error
	cause := errors.New("cause error")
	
	// Test UserInputError
	userErr := NewUserInputError("invalid input", cause)
	if userErr.Type != UserInputError {
		t.Errorf("Expected error type '%s', got '%s'", UserInputError, userErr.Type)
	}
	if userErr.Message != "invalid input" {
		t.Errorf("Expected error message 'invalid input', got '%s'", userErr.Message)
	}
	if userErr.Cause != cause {
		t.Errorf("Expected error cause '%v', got '%v'", cause, userErr.Cause)
	}
	
	// Test error message
	expected := "user_input_error: invalid input (caused by: cause error)"
	if userErr.Error() != expected {
		t.Errorf("Expected error message '%s', got '%s'", expected, userErr.Error())
	}
	
	// Test FileSystemError
	fileErr := NewFileSystemError("file not found", nil)
	if fileErr.Type != FileSystemError {
		t.Errorf("Expected error type '%s', got '%s'", FileSystemError, fileErr.Type)
	}
	
	// Test error message without cause
	expected = "file_system_error: file not found"
	if fileErr.Error() != expected {
		t.Errorf("Expected error message '%s', got '%s'", expected, fileErr.Error())
	}
	
	// Test APIError
	apiErr := NewAPIError("API request failed", nil)
	if apiErr.Type != APIError {
		t.Errorf("Expected error type '%s', got '%s'", APIError, apiErr.Type)
	}
	
	// Test UnknownError
	unknownErr := NewUnknownError("something went wrong", nil)
	if unknownErr.Type != UnknownError {
		t.Errorf("Expected error type '%s', got '%s'", UnknownError, unknownErr.Type)
	}
}

func TestHandleError(t *testing.T) {
	// This is a bit tricky to test since it calls os.Exit
	// We can test that it doesn't panic, but not much else
	err := errors.New("test error")
	
	// This shouldn't panic or exit
	HandleError(err, false)
	
	// Test nil error
	HandleError(nil, false)
	HandleError(nil, true)
}