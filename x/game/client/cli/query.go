package cli

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/spf13/cobra"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"

	"github.com/arcane-systems/rook/x/game/types"
)

// GetQueryCmd returns the cli query commands for this module
func GetQueryCmd(queryRoute string) *cobra.Command {
	// Group rook queries under a subcommand
	cmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      fmt.Sprintf("Querying commands for the %s module", types.ModuleName),
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	// this line is used by starport scaffolding # 1
	cmd.AddCommand(CmdQueryGame())

	return cmd
}

func CmdQueryGame() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "find [id|player]",
		Short: "Find a game by id or by player",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)
			queryClient := types.NewQueryClient(clientCtx)

			if strings.Contains(args[0], "rook") {
				req := &types.QueryGameByPlayerRequest{
					Player: args[0],
				}

				res, err := queryClient.FindByPlayer(context.Background(), req)
				if err != nil {
					return err
				}

				return clientCtx.PrintProto(res)
			}

			id, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return err
			}


			req := &types.QueryGameByIDRequest{
				Id: id,
			}

			res, err := queryClient.FindByID(context.Background(), req)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}

// func CmdQueryAllGames() *cobra.Command {

// }

func CmdQueryParams() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "params",
		Short: "Query the current game params",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)
			queryClient := types.NewQueryClient(clientCtx)

			req := &types.QueryParamsRequest{Version: 0}
			res, err := queryClient.Params(context.Background(), req)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
