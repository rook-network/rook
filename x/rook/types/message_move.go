package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgMove{}

func NewMsgMove(creator string, game_id string, position string, direction string, population string) *MsgMove {
	return &MsgMove{
		Creator:    creator,
		Game_id:    game_id,
		Position:   position,
		Direction:  direction,
		Population: population,
	}
}

func (msg *MsgMove) Route() string {
	return RouterKey
}

func (msg *MsgMove) Type() string {
	return "Move"
}

func (msg *MsgMove) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgMove) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgMove) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
