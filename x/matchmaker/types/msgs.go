package types

import (
	"fmt"

	game "github.com/cmwaters/rook/x/game/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgHost{}

func NewMsgHost(creator string, invitees []string, config *game.Config, public bool, quorum, capacity uint32) *MsgHost {
	return &MsgHost{
		Creator:  creator,
		Invitees: invitees,
		Config:   config,
		Public:   public,
		Quorum:   quorum,
		Capacity: capacity,
	}
}

func (msg *MsgHost) Route() string {
	return RouterKey
}

func (msg *MsgHost) Type() string {
	return "Host"
}

func (msg *MsgHost) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{signer}
}

func (msg *MsgHost) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgHost) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid host address (%s): %w", msg.Creator, err)
	}

	for _, invitee := range msg.Invitees {
		if _, err := sdk.AccAddressFromBech32(invitee); err != nil {
			return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid invitee (%s): %w", invitee, err)
		}
	}

	if err := msg.Config.ValidateBasic(int(msg.Capacity)); err != nil {
		return err
	}

	if msg.Capacity < 2 {
		return fmt.Errorf("capacity must be at least two got %d", msg.Capacity)
	}

	if msg.Quorum < 2 {
		return fmt.Errorf("quorum must be at least two got %d", msg.Quorum)
	}

	if msg.Quorum > msg.Capacity {
		return fmt.Errorf("quorum (%d) must be less than equat to capacity (%d)", msg.Quorum, msg.Capacity)
	}

	return nil
}

var _ sdk.Msg = &MsgJoin{}

func NewMsgJoin(creator string, roomID uint64) *MsgJoin {
	return &MsgJoin{
		Creator: creator,
		RoomId:  roomID,
	}
}

func (msg *MsgJoin) Route() string {
	return RouterKey
}

func (msg *MsgJoin) Type() string {
	return "Join"
}

func (msg *MsgJoin) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{signer}
}

func (msg *MsgJoin) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgJoin) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid address (%s): %w", msg.Creator, err)
	}

	return nil
}

var _ sdk.Msg = &MsgFind{}

func NewMsgFind(creator string, mode uint32) *MsgFind {
	return &MsgFind{
		Creator: creator,
		Mode:    mode,
	}
}

func (msg *MsgFind) Route() string {
	return RouterKey
}

func (msg *MsgFind) Type() string {
	return "Find"
}

func (msg *MsgFind) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{signer}
}

func (msg *MsgFind) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgFind) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid address (%s): %w", msg.Creator, err)
	}

	return nil
}

var _ sdk.Msg = &MsgReady{}

func NewMsgReady(creator string, roomID uint64) *MsgReady {
	return &MsgReady{
		Creator: creator,
		RoomId:  roomID,
	}
}

func (msg *MsgReady) Route() string {
	return RouterKey
}

func (msg *MsgReady) Type() string {
	return "Ready"
}

func (msg *MsgReady) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{signer}
}

func (msg *MsgReady) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgReady) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid address (%s): %w", msg.Creator, err)
	}

	return nil
}
