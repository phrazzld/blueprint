package cli

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/phrazzld/blueprint/internal/template"
	"github.com/phrazzld/blueprint/pkg/errors"
	"github.com/spf13/cobra"
)

// newCreateCmd creates a new create command
func newCreateCmd() *cobra.Command {
	var projectName string
	var projectPath string
	var useOpenAI bool

	cmd := &cobra.Command{
		Use:   "create [project-name]",
		Short: "Create a new project with Blueprint",
		Long:  "Create a new project with standardized documentation and structure",
		Args:  cobra.MaximumNArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			// If project name is provided as an argument, use it
			if len(args) > 0 {
				projectName = args[0]
			}

			// If project name is still empty, use "new-project" as default
			if projectName == "" {
				projectName = "new-project"
			}

			// If path is not provided, use current directory + project name
			if projectPath == "" {
				currentDir, err := os.Getwd()
				if err != nil {
					appErr := errors.NewFileSystemError("Failed to get current directory", err)
					logger.Error("Failed to get current directory", map[string]interface{}{
						"error": appErr.Error(),
					})
					errors.HandleError(appErr, true)
				}
				projectPath = filepath.Join(currentDir, projectName)
			}
			
			logger.Info("Creating new project", map[string]interface{}{
				"name": projectName,
				"path": projectPath,
				"openai": useOpenAI,
			})

			// Initialize project configuration
			initialConfig := ProjectConfig{
				Name: projectName,
			}
			
			// Run interactive prompts to gather project configuration
			config, err := runPrompts(initialConfig)
			if err != nil {
				appErr := errors.NewUserInputError("Failed to gather project configuration", err)
				logger.Error("Failed to gather project configuration", map[string]interface{}{
					"error": appErr.Error(),
				})
				errors.HandleError(appErr, true)
			}
			
			// Create the project directory
			if err := os.MkdirAll(projectPath, 0755); err != nil {
				appErr := errors.NewFileSystemError("Failed to create project directory", err)
				logger.Error("Failed to create project directory", map[string]interface{}{
					"error": appErr.Error(),
					"path": projectPath,
				})
				errors.HandleError(appErr, true)
			}

			// Find the templates directory
			var refsDir string
			
			// For testing: Check if we're in a test environment and there's a refs directory in the project path's parent
			testRefsDir := filepath.Join(filepath.Dir(projectPath), "refs")
			if _, err := os.Stat(testRefsDir); err == nil {
				refsDir = testRefsDir
			} else {
				// First, try to use the refs/ directory from the current working directory
				refsDir = filepath.Join(".", "refs")
				if _, err := os.Stat(refsDir); os.IsNotExist(err) {
					// Try to find it relative to the executable
					execPath, err := os.Executable()
					if err != nil {
						appErr := errors.NewFileSystemError("Failed to find executable path", err)
						logger.Error("Failed to find executable path", map[string]interface{}{
							"error": appErr.Error(),
						})
						errors.HandleError(appErr, true)
					}
					
					refsDir = filepath.Join(filepath.Dir(execPath), "..", "refs")
					if _, err := os.Stat(refsDir); os.IsNotExist(err) {
						appErr := errors.NewFileSystemError("Templates directory not found", nil)
						logger.Error("Templates directory not found", map[string]interface{}{
							"path": refsDir,
						})
						errors.HandleError(appErr, true)
					}
				}
			}
			
			logger.Info("Using templates directory", map[string]interface{}{
				"path": refsDir,
			})
			
			// Create a template service
			templateService := template.NewService(refsDir, useOpenAI)
			
			// Generate project files
			if err := templateService.GenerateProjectFiles(projectPath, config); err != nil {
				appErr := errors.NewFileSystemError("Failed to generate project files", err)
				logger.Error("Failed to generate project files", map[string]interface{}{
					"error": appErr.Error(),
				})
				errors.HandleError(appErr, true)
			}

			logger.Info("Project created successfully", map[string]interface{}{
				"name": config.Name,
				"path": projectPath,
			})

			fmt.Printf("\n✅ Created new project '%s' at: %s\n", config.Name, projectPath)
			fmt.Println("✅ Generated project files from templates")
			fmt.Println("🎉 Your project is ready to use!")
		},
	}

	// Add flags
	cmd.Flags().StringVarP(&projectName, "name", "n", "", "Name of the project")
	cmd.Flags().StringVarP(&projectPath, "path", "p", "", "Path where to create the project")
	cmd.Flags().BoolVarP(&useOpenAI, "openai", "o", false, "Use OpenAI to generate content")

	return cmd
}