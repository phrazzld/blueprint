package cli

import (
	"errors"
	"fmt"
	"regexp"
	"strings"

	"github.com/AlecAivazis/survey/v2"
)

// Available technology stacks
var techStacks = []string{
	"Node.js",
	"Go",
	"Python",
	"Java",
	"Ruby",
}

// Available analytics options
var analyticsOptions = []string{
	"Google Analytics",
	"Mixpanel",
	"Segment",
	"None",
}

// Available testing frameworks
var testFrameworks = map[string][]string{
	"Node.js": {"Jest", "Mocha", "Cypress"},
	"Go":      {"Go's built-in testing", "Testify", "Ginkgo"},
	"Python":  {"Pytest", "Unittest", "Robot Framework"},
	"Java":    {"JUnit", "TestNG", "Mockito"},
	"Ruby":    {"RSpec", "Minitest", "Cucumber"},
}

// Define a function type for runPrompts to allow mocking in tests
type promptFunc func(initialConfig ProjectConfig) (ProjectConfig, error)

// runPrompts is a variable holding the function to run interactive prompts
var runPrompts promptFunc = defaultRunPrompts

// defaultRunPrompts is the default implementation of prompts
func defaultRunPrompts(initialConfig ProjectConfig) (ProjectConfig, error) {
	config := initialConfig
	
	// Project Name prompt
	if config.Name == "" {
		if err := survey.AskOne(&survey.Input{
			Message: "Project name:",
			Help:    "The name of your project (e.g., my-awesome-project)",
		}, &config.Name, survey.WithValidator(validateProjectName)); err != nil {
			return config, err
		}
	}
	
	// Project Description prompt
	if err := survey.AskOne(&survey.Input{
		Message: "Project description:",
		Help:    "A brief description of your project",
	}, &config.Description); err != nil {
		return config, err
	}
	
	// Technology Stack prompt
	if err := survey.AskOne(&survey.Select{
		Message: "Select technology stack:",
		Options: techStacks,
		Default: techStacks[1], // Default to Go
	}, &config.TechStack); err != nil {
		return config, err
	}
	
	// Dockerization prompt
	if err := survey.AskOne(&survey.Confirm{
		Message: "Dockerize this project?",
		Default: true, // Default to yes as per ARCHITECTURE.md
	}, &config.Dockerization); err != nil {
		return config, err
	}
	
	// Analytics selection prompt
	if err := survey.AskOne(&survey.Select{
		Message: "Select analytics provider:",
		Options: analyticsOptions,
		Default: analyticsOptions[0], // Default to Google Analytics
	}, &config.Analytics); err != nil {
		return config, err
	}
	
	// Testing Framework prompt
	// Get the testing frameworks for the selected tech stack
	frameworks, ok := testFrameworks[config.TechStack]
	if !ok {
		frameworks = []string{"None"}
	}
	
	if err := survey.AskOne(&survey.Select{
		Message: "Select testing framework:",
		Options: frameworks,
		Default: frameworks[0], // Default to first option
	}, &config.TestFramework); err != nil {
		return config, err
	}
	
	// Feature Flags prompt
	if err := survey.AskOne(&survey.Confirm{
		Message: "Use feature flags?",
		Default: true, // Default to yes
	}, &config.FeatureFlags); err != nil {
		return config, err
	}
	
	// Display the collected configuration
	fmt.Println("\n📋 Project Configuration:")
	fmt.Printf("Name: %s\n", config.Name)
	fmt.Printf("Description: %s\n", config.Description)
	fmt.Printf("Technology: %s\n", config.TechStack)
	fmt.Printf("Dockerization: %v\n", config.Dockerization)
	fmt.Printf("Analytics: %s\n", config.Analytics)
	fmt.Printf("Testing: %s\n", config.TestFramework)
	fmt.Printf("Feature Flags: %v\n", config.FeatureFlags)
	
	return config, nil
}

// validateProjectName validates the project name
func validateProjectName(val interface{}) error {
	name, ok := val.(string)
	if !ok {
		return errors.New("expected string value for project name")
	}
	
	// Check if name is empty
	if strings.TrimSpace(name) == "" {
		return errors.New("project name cannot be empty")
	}
	
	// Check if name has invalid characters
	validName := regexp.MustCompile(`^[a-zA-Z0-9_\-\.]+$`)
	if !validName.MatchString(name) {
		return errors.New("project name can only contain letters, numbers, hyphens, underscores, and periods")
	}
	
	return nil
}