package openai

import (
	"fmt"
)

// OpenAIClient is an interface for the OpenAI client
type OpenAIClient interface {
	Complete(prompt string) (string, error)
}

// ContentType represents the type of content to generate
type ContentType string

const (
	// ContentTypePlan represents a PLAN.md file
	ContentTypePlan ContentType = "PLAN"
	
	// ContentTypeAesthetic represents an AESTHETIC.md file
	ContentTypeAesthetic ContentType = "AESTHETIC"
	
	// ContentTypeArchitecture represents an ARCHITECTURE.md file
	ContentTypeArchitecture ContentType = "ARCHITECTURE"
)

// ContentGenerator generates content using the OpenAI API
type ContentGenerator struct {
	Client OpenAIClient
}

// NewContentGenerator creates a new content generator
func NewContentGenerator(client OpenAIClient) *ContentGenerator {
	return &ContentGenerator{
		Client: client,
	}
}

// GenerateContent generates content of the specified type
func (g *ContentGenerator) GenerateContent(contentType ContentType, config interface{}) (string, error) {
	// Get the prompt for the specified content type
	prompt, err := g.getPromptForContentType(contentType, config)
	if err != nil {
		return "", fmt.Errorf("error getting prompt: %v", err)
	}
	
	// Generate completion
	content, err := g.Client.Complete(prompt)
	if err != nil {
		return "", fmt.Errorf("error generating content: %v", err)
	}
	
	return content, nil
}

// getPromptForContentType returns the prompt for the specified content type
func (g *ContentGenerator) getPromptForContentType(contentType ContentType, config interface{}) (string, error) {
	switch contentType {
	case ContentTypePlan:
		return g.getPlanPrompt(config)
	case ContentTypeAesthetic:
		return g.getAestheticPrompt(config)
	case ContentTypeArchitecture:
		return g.getArchitecturePrompt(config)
	default:
		return "", fmt.Errorf("unsupported content type: %s", contentType)
	}
}

// getPlanPrompt returns the prompt for generating a PLAN.md file
func (g *ContentGenerator) getPlanPrompt(config interface{}) (string, error) {
	return `Create a comprehensive PLAN.md document for a software project.
This document should provide a detailed specification for the project,
including its goals, features, acceptance criteria, and other important aspects.

Please structure the document with the following sections:
1. Project Overview
2. Goals
3. Features
4. Acceptance Criteria
5. Implementation Details

Make it detailed, well-organized, and useful for developers to understand
what needs to be built.`, nil
}

// getAestheticPrompt returns the prompt for generating an AESTHETIC.md file
func (g *ContentGenerator) getAestheticPrompt(config interface{}) (string, error) {
	return `Create an AESTHETIC.md document for a software project.
This document should outline the UI/UX, visual design standards, typography,
colors, animations, and responsiveness expectations for the project.

Please structure the document with the following sections:
1. Design Principles
2. Color Palette
3. Typography
4. Spacing & Layout
5. Components
6. Responsive Design
7. Animations

Make it detailed, well-organized, and useful for designers and developers
to maintain a consistent visual identity.`, nil
}

// getArchitecturePrompt returns the prompt for generating an ARCHITECTURE.md file
func (g *ContentGenerator) getArchitecturePrompt(config interface{}) (string, error) {
	return `Create an ARCHITECTURE.md document for a software project.
This document should define the preferred technical architecture, including
deployment strategy, analytics integration, API design, error handling, and more.

Please structure the document with the following sections:
1. System Overview
2. Component Architecture
3. Data Flow
4. API Design
5. Error Handling
6. Deployment Strategy
7. Monitoring & Observability
8. Security Considerations

Make it detailed, well-organized, and useful for developers to understand
the architectural decisions and technical specifications.`, nil
}