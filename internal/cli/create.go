package cli

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/phrazzld/blueprint/internal/template"
	"github.com/spf13/cobra"
)

// newCreateCmd creates a new create command
func newCreateCmd() *cobra.Command {
	var projectName string
	var projectPath string

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
					fmt.Fprintf(os.Stderr, "Error getting current directory: %v\n", err)
					os.Exit(1)
				}
				projectPath = filepath.Join(currentDir, projectName)
			}

			// Initialize project configuration
			initialConfig := ProjectConfig{
				Name: projectName,
			}
			
			// Run interactive prompts to gather project configuration
			config, err := runPrompts(initialConfig)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error during interactive prompts: %v\n", err)
				os.Exit(1)
			}
			
			// Create the project directory
			if err := os.MkdirAll(projectPath, 0755); err != nil {
				fmt.Fprintf(os.Stderr, "Error creating project directory: %v\n", err)
				os.Exit(1)
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
						fmt.Fprintf(os.Stderr, "Error finding executable path: %v\n", err)
						os.Exit(1)
					}
					
					refsDir = filepath.Join(filepath.Dir(execPath), "..", "refs")
					if _, err := os.Stat(refsDir); os.IsNotExist(err) {
						fmt.Fprintf(os.Stderr, "Error: templates directory not found\n")
						os.Exit(1)
					}
				}
			}
			
			// Create a template service
			templateService := template.NewService(refsDir)
			
			// Generate project files
			if err := templateService.GenerateProjectFiles(projectPath, config); err != nil {
				fmt.Fprintf(os.Stderr, "Error generating project files: %v\n", err)
				os.Exit(1)
			}

			fmt.Printf("\n✅ Created new project '%s' at: %s\n", config.Name, projectPath)
			fmt.Println("✅ Generated project files from templates")
			fmt.Println("🎉 Your project is ready to use!")
		},
	}

	// Add flags
	cmd.Flags().StringVarP(&projectName, "name", "n", "", "Name of the project")
	cmd.Flags().StringVarP(&projectPath, "path", "p", "", "Path where to create the project")

	return cmd
}