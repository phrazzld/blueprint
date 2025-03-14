package openai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

const (
	// OpenAIAPIURL is the base URL for the OpenAI API
	OpenAIAPIURL = "https://api.openai.com/v1/chat/completions"
)

// Client is the OpenAI API client
type Client struct {
	APIKey string
	Model  string
}

// Message is a single message in a conversation
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// Request is the request body for the OpenAI API
type Request struct {
	Model     string    `json:"model"`
	Messages  []Message `json:"messages"`
	MaxTokens int       `json:"max_tokens,omitempty"`
}

// ResponseChoice is a single response choice
type ResponseChoice struct {
	Message      Message `json:"message"`
	FinishReason string  `json:"finish_reason"`
}

// Response is the response from the OpenAI API
type Response struct {
	ID      string           `json:"id"`
	Object  string           `json:"object"`
	Created int64            `json:"created"`
	Choices []ResponseChoice `json:"choices"`
}

// NewClient creates a new OpenAI client
func NewClient() (*Client, error) {
	// Get API key from environment
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("OPENAI_API_KEY environment variable is not set")
	}
	
	return &Client{
		APIKey: apiKey,
		Model:  "gpt-4", // Default to GPT-4
	}, nil
}

// Complete generates a completion using the OpenAI API
func (c *Client) Complete(prompt string) (string, error) {
	// Create the request
	messages := []Message{
		{
			Role:    "system",
			Content: "You are a helpful assistant that generates markdown content for software projects.",
		},
		{
			Role:    "user",
			Content: prompt,
		},
	}
	
	reqBody := Request{
		Model:    c.Model,
		Messages: messages,
	}
	
	// Convert request to JSON
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("error marshalling request: %v", err)
	}
	
	// Create HTTP request
	req, err := http.NewRequest("POST", OpenAIAPIURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("error creating request: %v", err)
	}
	
	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.APIKey))
	
	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error sending request: %v", err)
	}
	defer resp.Body.Close()
	
	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response: %v", err)
	}
	
	// Check response status code
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}
	
	// Parse response
	var openaiResp Response
	if err := json.Unmarshal(body, &openaiResp); err != nil {
		return "", fmt.Errorf("error parsing response: %v", err)
	}
	
	// Check if we have choices
	if len(openaiResp.Choices) == 0 {
		return "", fmt.Errorf("no completions returned from API")
	}
	
	// Return the first choice's content
	return openaiResp.Choices[0].Message.Content, nil
}