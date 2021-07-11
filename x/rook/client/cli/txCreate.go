package cli

import (
	"github.com/spf13/cobra"
	"strconv"

	"github.com/cmwaters/rook/x/rook/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
)

var _ = strconv.Itoa(0)

func CmdCreate() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create [game_id] [settlement] [position]",
		Short: "Broadcast message create",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			argsGame_id := string(args[0])
			argsSettlement := string(args[1])
			argsPosition := string(args[2])

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgCreate(clientCtx.GetFromAddress().String(), string(argsGame_id), string(argsSettlement), string(argsPosition))
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
