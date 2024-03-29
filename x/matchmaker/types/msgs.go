package types

import (
	"errors"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgHost{}

func NewMsgHost(host string, invitees []string, mode *Mode, public bool) *MsgHost {
	return &MsgHost{
		Host:     host,
		Invitees: invitees,
		Game:     &MsgHost_Mode{Mode: mode},
		Public:   public,
	}
}

func NewMsgHostByModeID(host string, invitees []string, modeID uint32, public bool) *MsgHost {
	return &MsgHost{
		Host:     host,
		Invitees: invitees,
		Game:     &MsgHost_ModeId{ModeId: modeID},
		Public:   public,
	}
}

func (msg *MsgHost) Route() string {
	return RouterKey
}

func (msg *MsgHost) Type() string {
	return "Host"
}

func (msg *MsgHost) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Host)
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
	_, err := sdk.AccAddressFromBech32(msg.Host)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid host address (%s): %v", msg.Host, err)
	}

	for _, invitee := range msg.Invitees {
		if _, err := sdk.AccAddressFromBech32(invitee); err != nil {
			return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid invitee (%s): %v", invitee, err)
		}
	}

	if len(msg.Invitees) >= MaxRoomCapacity {
		return errors.New("invited players exceeds max room capacity")
	}

	switch m := msg.Game.(type) {
	case *MsgHost_Mode:
		if err := m.Mode.ValidateBasic(); err != nil {
			return err
		}

	case *MsgHost_ModeId:
		if m.ModeId == 0 {
			return errors.New("modeID must be non zero")
		}
	default:
		return errors.New("unknown game type")
	}

	return nil
}

var _ sdk.Msg = &MsgJoin{}

func NewMsgJoin(player string, roomID uint64) *MsgJoin {
	return &MsgJoin{
		Player: player,
		RoomId: roomID,
	}
}

func (msg *MsgJoin) Route() string {
	return RouterKey
}

func (msg *MsgJoin) Type() string {
	return "Join"
}

func (msg *MsgJoin) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Player)
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
	_, err := sdk.AccAddressFromBech32(msg.Player)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid address (%s): %v", msg.Player, err)
	}

	return nil
}

var _ sdk.Msg = &MsgFind{}

func NewMsgFind(player string, mode uint32) *MsgFind {
	return &MsgFind{
		Player: player,
		Mode:   mode,
	}
}

func (msg *MsgFind) Route() string {
	return RouterKey
}

func (msg *MsgFind) Type() string {
	return "Find"
}

func (msg *MsgFind) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Player)
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
	_, err := sdk.AccAddressFromBech32(msg.Player)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid address (%s): %v", msg.Player, err)
	}

	return nil
}

var _ sdk.Msg = &MsgLeave{}

func NewMsgLeave(player string, roomID uint64) *MsgLeave {
	return &MsgLeave{
		Player: player,
		RoomId: roomID,
	}
}

func (msg *MsgLeave) Route() string {
	return RouterKey
}

func (msg *MsgLeave) Type() string {
	return "Leave"
}

func (msg *MsgLeave) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Player)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{signer}
}

func (msg *MsgLeave) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgLeave) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Player)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid address (%s): %v", msg.Player, err)
	}

	return nil
}

var _ sdk.Msg = &MsgAddMode{}

func NewMsgAddMode(authority string, mode Mode) *MsgAddMode {
	return &MsgAddMode{
		Authority: authority,
		Mode:      mode,
	}
}

func (msg *MsgAddMode) Route() string {
	return RouterKey
}

func (msg *MsgAddMode) Type() string {
	return "AddMode"
}

func (msg *MsgAddMode) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Authority)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{signer}
}

func (msg *MsgAddMode) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgAddMode) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Authority)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid address (%s): %v", msg.Authority, err)
	}

	return msg.Mode.ValidateBasic()
}

var _ sdk.Msg = &MsgRemoveMode{}

func NewMsgRemoveMode(authority string, mode uint32) *MsgRemoveMode {
	return &MsgRemoveMode{
		Authority: authority,
		Id:        mode,
	}
}

func (msg *MsgRemoveMode) Route() string {
	return RouterKey
}

func (msg *MsgRemoveMode) Type() string {
	return "RemoveMode"
}

func (msg *MsgRemoveMode) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Authority)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{signer}
}

func (msg *MsgRemoveMode) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgRemoveMode) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Authority)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid address (%s): %v", msg.Authority, err)
	}

	return nil
}
