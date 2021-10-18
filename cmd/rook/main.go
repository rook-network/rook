package main

import (
	"os"

	"github.com/arcane-systems/rook/app"
	"github.com/arcane-systems/rook/cmd/rook/cmd"
	svrcmd "github.com/cosmos/cosmos-sdk/server/cmd"
)

func main() {
	rootCmd, _ := cmd.NewRootCmd()
	if err := svrcmd.Execute(rootCmd, app.DefaultNodeHome); err != nil {
		os.Exit(1)
	}
}