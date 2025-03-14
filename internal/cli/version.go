package cli

import (
	"fmt"

	"github.com/spf13/cobra"
)

// newVersionCmd creates a new version command
func newVersionCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "version",
		Short: "Display the version of Blueprint",
		Long:  "Display the version of Blueprint CLI tool",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Printf("Blueprint version %s\n", version)
		},
	}
}