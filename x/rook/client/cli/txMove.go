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

func CmdMove() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "move [game_id] [position] [direction] [population]",
		Short: "Broadcast message move",
		Args:  cobra.ExactArgs(4),
		RunE: func(cmd *cobra.Command, args []string) error {
			argsGame_id := string(args[0])
			argsPosition := string(args[1])
			argsDirection := string(args[2])
			argsPopulation := string(args[3])

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgMove(clientCtx.GetFromAddress().String(), string(argsGame_id), string(argsPosition), string(argsDirection), string(argsPopulation))
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
