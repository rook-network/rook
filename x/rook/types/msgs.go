package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgCreate{}

func NewMsgCreate(players []string, config *GameConfig) *MsgCreate {
	return &MsgCreate{
		Players: players,
		Config:  config,
	}
}

func (msg *MsgCreate) Route() string {
	return RouterKey
}

func (msg *MsgCreate) Type() string {
	return "Create"
}

func (msg *MsgCreate) GetSigners() []sdk.AccAddress {
	signers := make([]sdk.AccAddress, len(msg.Players))
	for idx, player := range msg.Players {
		signer, err := sdk.AccAddressFromBech32(player)
		if err != nil {
			panic(err)
		}
		signers[idx] = signer
	}
	return signers
}

func (msg *MsgCreate) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgCreate) ValidateBasic() error {
	for _, player := range msg.Players {
		if _, err := sdk.AccAddressFromBech32(player); err != nil {
			return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid player address (%s)", err)
		}
	}
	return nil
}

var _ sdk.Msg = &MsgMove{}

func NewMsgMove(creator string, gameId uint64, position *Position, direction Direction, population uint32) *MsgMove {
	return &MsgMove{
		Creator:    creator,
		GameId:     gameId,
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

var _ sdk.Msg = &MsgBuild{}

func NewMsgBuild(creator string, gameId uint64, settlement Settlement, position *Position) *MsgBuild {
	return &MsgBuild{
		Creator:    creator,
		GameId:     gameId,
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