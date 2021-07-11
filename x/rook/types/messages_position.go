package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgCreatePosition{}

func NewMsgCreatePosition(creator string, x string, y string) *MsgCreatePosition {
  return &MsgCreatePosition{
		Creator: creator,
    X: x,
    Y: y,
	}
}

func (msg *MsgCreatePosition) Route() string {
  return RouterKey
}

func (msg *MsgCreatePosition) Type() string {
  return "CreatePosition"
}

func (msg *MsgCreatePosition) GetSigners() []sdk.AccAddress {
  creator, err := sdk.AccAddressFromBech32(msg.Creator)
  if err != nil {
    panic(err)
  }
  return []sdk.AccAddress{creator}
}

func (msg *MsgCreatePosition) GetSignBytes() []byte {
  bz := ModuleCdc.MustMarshalJSON(msg)
  return sdk.MustSortJSON(bz)
}

func (msg *MsgCreatePosition) ValidateBasic() error {
  _, err := sdk.AccAddressFromBech32(msg.Creator)
  	if err != nil {
  		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
  	}
  return nil
}

var _ sdk.Msg = &MsgUpdatePosition{}

func NewMsgUpdatePosition(creator string, id uint64, x string, y string) *MsgUpdatePosition {
  return &MsgUpdatePosition{
        Id: id,
		Creator: creator,
    X: x,
    Y: y,
	}
}

func (msg *MsgUpdatePosition) Route() string {
  return RouterKey
}

func (msg *MsgUpdatePosition) Type() string {
  return "UpdatePosition"
}

func (msg *MsgUpdatePosition) GetSigners() []sdk.AccAddress {
  creator, err := sdk.AccAddressFromBech32(msg.Creator)
  if err != nil {
    panic(err)
  }
  return []sdk.AccAddress{creator}
}

func (msg *MsgUpdatePosition) GetSignBytes() []byte {
  bz := ModuleCdc.MustMarshalJSON(msg)
  return sdk.MustSortJSON(bz)
}

func (msg *MsgUpdatePosition) ValidateBasic() error {
  _, err := sdk.AccAddressFromBech32(msg.Creator)
  if err != nil {
    return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
  }
   return nil
}

var _ sdk.Msg = &MsgDeletePosition{}

func NewMsgDeletePosition(creator string, id uint64) *MsgDeletePosition {
  return &MsgDeletePosition{
        Id: id,
		Creator: creator,
	}
} 
func (msg *MsgDeletePosition) Route() string {
  return RouterKey
}

func (msg *MsgDeletePosition) Type() string {
  return "DeletePosition"
}

func (msg *MsgDeletePosition) GetSigners() []sdk.AccAddress {
  creator, err := sdk.AccAddressFromBech32(msg.Creator)
  if err != nil {
    panic(err)
  }
  return []sdk.AccAddress{creator}
}

func (msg *MsgDeletePosition) GetSignBytes() []byte {
  bz := ModuleCdc.MustMarshalJSON(msg)
  return sdk.MustSortJSON(bz)
}

func (msg *MsgDeletePosition) ValidateBasic() error {
  _, err := sdk.AccAddressFromBech32(msg.Creator)
  if err != nil {
    return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
  }
  return nil
}
