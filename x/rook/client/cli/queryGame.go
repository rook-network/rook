package cli

import (
    "context"
    "strconv"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
    "github.com/cmwaters/rook/x/rook/types"
)

func CmdQueryGame() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "game [id]",
		Short: "returns the current game state",
        Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
            clientCtx := client.GetClientContextFromCmd(cmd)

            id, err := strconv.ParseUint(args[0], 10, 64)
            if err != nil {
                return err
            }

            queryClient := types.NewQueryClient(clientCtx)

            params := &types.Query{
                Pagination: pageReq,
            }

            res, err := queryClient.PositionAll(context.Background(), params)
            if err != nil {
                return err
            }

            return clientCtx.PrintProto(res)
		},
	}

	flags.AddPaginationFlagsToCmd(cmd, cmd.Use)
	flags.AddQueryFlagsToCmd(cmd)

    return cmd
}

func CmdShowPosition() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-position [id]",
		Short: "shows a position",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
            clientCtx := client.GetClientContextFromCmd(cmd)

            queryClient := types.NewQueryClient(clientCtx)

            id, err := strconv.ParseUint(args[0], 10, 64)
            if err != nil {
                return err
            }

            params := &types.QueryGetPositionRequest{
                Id: id,
            }

            res, err := queryClient.Position(context.Background(), params)
            if err != nil {
                return err
            }

            return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

    return cmd
}
