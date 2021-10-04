package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgActivate{}

func NewMsgActivate(claimee string) *MsgActivate {
	return &MsgActivate{
		Claimee: claimee,
	}
}

func (msg *MsgActivate) Route() string {
	return RouterKey
}

func (msg *MsgActivate) Type() string {
	return "Activate"
}

func (msg *MsgActivate) GetSigners() []sdk.AccAddress {
	signer, err := sdk.AccAddressFromBech32(msg.Claimee)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{signer}
}

func (msg *MsgActivate) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgActivate) ValidateBasic() error {
	if _, err := sdk.AccAddressFromBech32(msg.Claimee); err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid claimee address (%s)", err)
	}

	return nil
}
