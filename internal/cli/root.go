package cli

import (
	"fmt"
	"os"

	"github.com/phrazzld/blueprint/pkg/log"
	"github.com/spf13/cobra"
)

var (
	version    = "0.1.0"
	logger     *log.Logger
	logLevel   string
	verboseLog bool
)

// NewRootCmd creates and returns the root command for the blueprint CLI
func NewRootCmd() *cobra.Command {
	rootCmd := &cobra.Command{
		Use:   "blueprint",
		Short: "Blueprint - Project scaffolding tool",
		Long: `Blueprint is a CLI tool that helps you set up new projects with standardized documentation,
configuration, and best practices. It creates a consistent foundation for your projects
by generating markdown templates and directory structures.`,
		Version: version,
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			// Initialize logger
			var level log.Level
			switch logLevel {
			case "debug":
				level = log.DEBUG
			case "info":
				level = log.INFO
			case "warn":
				level = log.WARN
			case "error":
				level = log.ERROR
			default:
				level = log.INFO
			}
			
			logger = log.NewLogger(level)
			logger.Info("Blueprint CLI starting", map[string]interface{}{
				"version": version,
				"logLevel": logLevel,
			})
		},
		Run: func(cmd *cobra.Command, args []string) {
			// If no subcommand is provided, show help
			cmd.Help()
		},
	}

	// Add persistent flags
	rootCmd.PersistentFlags().StringVar(&logLevel, "log-level", "info", "Set log level (debug, info, warn, error)")
	rootCmd.PersistentFlags().BoolVarP(&verboseLog, "verbose", "v", false, "Enable verbose output")
	
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