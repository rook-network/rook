package types

import (
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"
)

func RegisterCodec(cdc *codec.LegacyAmino) {
	// this line is used by starport scaffolding # 2
	cdc.RegisterConcrete(&MsgCreate{}, "rook/MsgCreate", nil)

	cdc.RegisterConcrete(&MsgMove{}, "rook/MsgMove", nil)

	cdc.RegisterConcrete(&MsgBuild{}, "rook/MsgBuild", nil)

}

func RegisterInterfaces(registry cdctypes.InterfaceRegistry) {
	// this line is used by starport scaffolding # 3
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgCreate{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgMove{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgBuild{},
	)

	msgservice.RegisterMsgServiceDesc(registry, &_Msg_serviceDesc)
}

var (
	amino     = codec.NewLegacyAmino()
	ModuleCdc = codec.NewProtoCodec(cdctypes.NewInterfaceRegistry())
)
