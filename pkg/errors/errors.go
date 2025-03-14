package errors

import (
	"fmt"
	"os"
)

// ErrorType represents the type of error
type ErrorType string

const (
	// UserInputError represents an error caused by invalid user input
	UserInputError ErrorType = "user_input_error"
	
	// FileSystemError represents an error caused by file system operations
	FileSystemError ErrorType = "file_system_error"
	
	// APIError represents an error caused by API calls
	APIError ErrorType = "api_error"
	
	// UnknownError represents an unknown error
	UnknownError ErrorType = "unknown_error"
)

// AppError represents an application-level error
type AppError struct {
	Type    ErrorType
	Message string
	Cause   error
}

// Error implements the error interface
func (e *AppError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("%s: %s (caused by: %v)", e.Type, e.Message, e.Cause)
	}
	return fmt.Sprintf("%s: %s", e.Type, e.Message)
}

// NewUserInputError creates a new user input error
func NewUserInputError(message string, cause error) *AppError {
	return &AppError{
		Type:    UserInputError,
		Message: message,
		Cause:   cause,
	}
}

// NewFileSystemError creates a new file system error
func NewFileSystemError(message string, cause error) *AppError {
	return &AppError{
		Type:    FileSystemError,
		Message: message,
		Cause:   cause,
	}
}

// NewAPIError creates a new API error
func NewAPIError(message string, cause error) *AppError {
	return &AppError{
		Type:    APIError,
		Message: message,
		Cause:   cause,
	}
}

// NewUnknownError creates a new unknown error
func NewUnknownError(message string, cause error) *AppError {
	return &AppError{
		Type:    UnknownError,
		Message: message,
		Cause:   cause,
	}
}

// HandleError handles an error and exits if necessary
func HandleError(err error, exitOnError bool) {
	if err == nil {
		return
	}
	
	// Print the error
	fmt.Fprintf(os.Stderr, "Error: %v\n", err)
	
	// Exit if requested
	if exitOnError {
		os.Exit(1)
	}
}