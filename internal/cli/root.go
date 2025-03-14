package cli

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var version = "0.1.0"

// NewRootCmd creates and returns the root command for the blueprint CLI
func NewRootCmd() *cobra.Command {
	rootCmd := &cobra.Command{
		Use:   "blueprint",
		Short: "Blueprint - Project scaffolding tool",
		Long: `Blueprint is a CLI tool that helps you set up new projects with standardized documentation,
configuration, and best practices. It creates a consistent foundation for your projects
by generating markdown templates and directory structures.`,
		Version: version,
		Run: func(cmd *cobra.Command, args []string) {
			// If no subcommand is provided, show help
			cmd.Help()
		},
	}

	// Add subcommands
	rootCmd.AddCommand(
		newVersionCmd(),
		newCreateCmd(),
	)
	
	return rootCmd
}

// Execute runs the root command
func Execute() {
	rootCmd := NewRootCmd()
	
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}