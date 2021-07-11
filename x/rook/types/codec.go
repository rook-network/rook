package types

import (
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"
)

func RegisterCodec(cdc *codec.LegacyAmino) {
	// this line is used by starport scaffolding # 2
cdc.RegisterConcrete(&MsgCreatePosition{}, "rook/CreatePosition", nil)
cdc.RegisterConcrete(&MsgUpdatePosition{}, "rook/UpdatePosition", nil)
cdc.RegisterConcrete(&MsgDeletePosition{}, "rook/DeletePosition", nil)

	cdc.RegisterConcrete(&MsgMove{}, "rook/Move", nil)

	cdc.RegisterConcrete(&MsgBuild{}, "rook/Build", nil)

}

func RegisterInterfaces(registry cdctypes.InterfaceRegistry) {
	// this line is used by starport scaffolding # 3
registry.RegisterImplementations((*sdk.Msg)(nil),
	&MsgCreatePosition{},
	&MsgUpdatePosition{},
	&MsgDeletePosition{},
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
