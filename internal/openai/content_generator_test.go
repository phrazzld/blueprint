package openai

import (
	"testing"
)

// MockClient is a mock implementation of the OpenAI client for testing
type MockClient struct {
	ReturnContent string
	ReturnError   error
}

// Complete implements the Complete method of the OpenAI client
func (m *MockClient) Complete(prompt string) (string, error) {
	return m.ReturnContent, m.ReturnError
}

func TestGetPromptForContentType(t *testing.T) {
	// Create a content generator with a mock client
	mockClient := &MockClient{}
	generator := NewContentGenerator(mockClient)
	
	// Test each content type
	testCases := []struct {
		contentType ContentType
		expectError bool
	}{
		{ContentTypePlan, false},
		{ContentTypeAesthetic, false},
		{ContentTypeArchitecture, false},
		{ContentType("invalid"), true},
	}
	
	for _, tc := range testCases {
		prompt, err := generator.getPromptForContentType(tc.contentType, nil)
		
		if tc.expectError && err == nil {
			t.Errorf("Expected error for content type '%s', but got none", tc.contentType)
		}
		
		if !tc.expectError {
			if err != nil {
				t.Errorf("Unexpected error for content type '%s': %v", tc.contentType, err)
			}
			
			if prompt == "" {
				t.Errorf("Expected non-empty prompt for content type '%s'", tc.contentType)
			}
		}
	}
}