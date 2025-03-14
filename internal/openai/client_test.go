package openai

import (
	"os"
	"testing"
)

func TestNewClient(t *testing.T) {
	// Save the original API key and restore it later
	originalAPIKey := os.Getenv("OPENAI_API_KEY")
	defer os.Setenv("OPENAI_API_KEY", originalAPIKey)
	
	// Test without API key
	os.Unsetenv("OPENAI_API_KEY")
	client, err := NewClient()
	if err == nil {
		t.Error("Expected error when API key is not set, but got none")
	}
	if client != nil {
		t.Error("Expected nil client when API key is not set")
	}
	
	// Test with API key
	os.Setenv("OPENAI_API_KEY", "test-api-key")
	client, err = NewClient()
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}
	if client == nil {
		t.Error("Expected non-nil client when API key is set")
	}
	if client.APIKey != "test-api-key" {
		t.Errorf("Expected API key to be 'test-api-key', got '%s'", client.APIKey)
	}
	if client.Model != "gpt-4" {
		t.Errorf("Expected model to be 'gpt-4', got '%s'", client.Model)
	}
}