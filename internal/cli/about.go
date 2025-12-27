package cli

import (
	"fmt"
	"runtime"

	"github.com/spf13/cobra"
)

var aboutCmd = &cobra.Command{
	Use:   "about",
	Short: "Display information about mdbub",
	Long:  "Display version, build information, and configuration details about mdbub.",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("╔════════════════════════════════════════╗")
		fmt.Println("║           mdbub - Go Edition          ║")
		fmt.Println("╚════════════════════════════════════════╝")
		fmt.Println()
		fmt.Printf("Version:     %s\n", version)
		fmt.Printf("Go Version:  %s\n", runtime.Version())
		fmt.Printf("Platform:    %s/%s\n", runtime.GOOS, runtime.GOARCH)
		fmt.Println()
		fmt.Println("A mindmap tool for your terminal.")
		fmt.Println("Fast. Fluid. Keyboard-native.")
		fmt.Println("Built for thinkers who live in the CLI.")
		fmt.Println()
		fmt.Println("Rewritten from Python to Go for better performance")
		fmt.Println("and easier distribution.")
		fmt.Println()
		fmt.Println("Repository: https://github.com/collabinator/mdbubbles")
		fmt.Println("License:    Apache-2.0")
	},
}
