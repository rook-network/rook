package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgBuild{}

func NewMsgBuild(creator string, game_id string, settlement string, position string) *MsgBuild {
	return &MsgBuild{
		Creator:    creator,
		Game_id:    game_id,
		Settlement: settlement,
		Position:   position,
	}
}

func (msg *MsgBuild) Route() string {
	return RouterKey
}

func (msg *MsgBuild) Type() string {
	return "Build"
}

func (msg *MsgBuild) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgBuild) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgBuild) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
