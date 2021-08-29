// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: rook/matchmaker/matchmaker.proto

package types

import (
	fmt "fmt"
	types "github.com/cmwaters/rook/x/game/types"
	_ "github.com/gogo/protobuf/gogoproto"
	proto "github.com/gogo/protobuf/proto"
	github_com_gogo_protobuf_types "github.com/gogo/protobuf/types"
	_ "google.golang.org/protobuf/types/known/durationpb"
	_ "google.golang.org/protobuf/types/known/timestamppb"
	io "io"
	math "math"
	math_bits "math/bits"
	time "time"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf
var _ = time.Kitchen

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion3 // please upgrade the proto package

type Room struct {
	// the config to be used for the game
	Config types.Config `protobuf:"bytes,1,opt,name=config,proto3" json:"config"`
	// the current players in the room
	Players []string `protobuf:"bytes,2,rep,name=players,proto3" json:"players,omitempty"`
	// pending invitations for players that can join (like a whitelist)
	Pending []string `protobuf:"bytes,3,rep,name=pending,proto3" json:"pending,omitempty"`
	// anyone can join
	Public bool `protobuf:"varint,4,opt,name=public,proto3" json:"public,omitempty"`
	// the minimum amount of players needed to start a game
	Quorum uint32 `protobuf:"varint,5,opt,name=quorum,proto3" json:"quorum,omitempty"`
	// the max amount of players that can join the room
	Capacity uint32 `protobuf:"varint,6,opt,name=capacity,proto3" json:"capacity,omitempty"`
	// if this is part of the standard mode pools it will have a corresponding
	// mode id
	ModeId uint32 `protobuf:"varint,7,opt,name=mode_id,json=modeId,proto3" json:"mode_id,omitempty"`
	// Types that are valid to be assigned to Time:
	//	*Room_Created
	//	*Room_Ready
	//	*Room_Scheduled
	Time isRoom_Time `protobuf_oneof:"time"`
}

func (m *Room) Reset()         { *m = Room{} }
func (m *Room) String() string { return proto.CompactTextString(m) }
func (*Room) ProtoMessage()    {}
func (*Room) Descriptor() ([]byte, []int) {
	return fileDescriptor_d29eb5cfff5372ca, []int{0}
}
func (m *Room) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *Room) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_Room.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *Room) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Room.Merge(m, src)
}
func (m *Room) XXX_Size() int {
	return m.Size()
}
func (m *Room) XXX_DiscardUnknown() {
	xxx_messageInfo_Room.DiscardUnknown(m)
}

var xxx_messageInfo_Room proto.InternalMessageInfo

type isRoom_Time interface {
	isRoom_Time()
	MarshalTo([]byte) (int, error)
	Size() int
}

type Room_Created struct {
	Created *time.Time `protobuf:"bytes,8,opt,name=created,proto3,oneof,stdtime" json:"created,omitempty"`
}
type Room_Ready struct {
	Ready *time.Time `protobuf:"bytes,9,opt,name=ready,proto3,oneof,stdtime" json:"ready,omitempty"`
}
type Room_Scheduled struct {
	Scheduled *time.Time `protobuf:"bytes,10,opt,name=scheduled,proto3,oneof,stdtime" json:"scheduled,omitempty"`
}

func (*Room_Created) isRoom_Time()   {}
func (*Room_Ready) isRoom_Time()     {}
func (*Room_Scheduled) isRoom_Time() {}

func (m *Room) GetTime() isRoom_Time {
	if m != nil {
		return m.Time
	}
	return nil
}

func (m *Room) GetConfig() types.Config {
	if m != nil {
		return m.Config
	}
	return types.Config{}
}

func (m *Room) GetPlayers() []string {
	if m != nil {
		return m.Players
	}
	return nil
}

func (m *Room) GetPending() []string {
	if m != nil {
		return m.Pending
	}
	return nil
}

func (m *Room) GetPublic() bool {
	if m != nil {
		return m.Public
	}
	return false
}

func (m *Room) GetQuorum() uint32 {
	if m != nil {
		return m.Quorum
	}
	return 0
}

func (m *Room) GetCapacity() uint32 {
	if m != nil {
		return m.Capacity
	}
	return 0
}

func (m *Room) GetModeId() uint32 {
	if m != nil {
		return m.ModeId
	}
	return 0
}

func (m *Room) GetCreated() *time.Time {
	if x, ok := m.GetTime().(*Room_Created); ok {
		return x.Created
	}
	return nil
}

func (m *Room) GetReady() *time.Time {
	if x, ok := m.GetTime().(*Room_Ready); ok {
		return x.Ready
	}
	return nil
}

func (m *Room) GetScheduled() *time.Time {
	if x, ok := m.GetTime().(*Room_Scheduled); ok {
		return x.Scheduled
	}
	return nil
}

// XXX_OneofWrappers is for the internal use of the proto package.
func (*Room) XXX_OneofWrappers() []interface{} {
	return []interface{}{
		(*Room_Created)(nil),
		(*Room_Ready)(nil),
		(*Room_Scheduled)(nil),
	}
}

// Rooms represents a set of rooms by id
type Rooms struct {
	Ids []uint64 `protobuf:"varint,1,rep,packed,name=ids,proto3" json:"ids,omitempty"`
}

func (m *Rooms) Reset()         { *m = Rooms{} }
func (m *Rooms) String() string { return proto.CompactTextString(m) }
func (*Rooms) ProtoMessage()    {}
func (*Rooms) Descriptor() ([]byte, []int) {
	return fileDescriptor_d29eb5cfff5372ca, []int{1}
}
func (m *Rooms) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *Rooms) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_Rooms.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *Rooms) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Rooms.Merge(m, src)
}
func (m *Rooms) XXX_Size() int {
	return m.Size()
}
func (m *Rooms) XXX_DiscardUnknown() {
	xxx_messageInfo_Rooms.DiscardUnknown(m)
}

var xxx_messageInfo_Rooms proto.InternalMessageInfo

func (m *Rooms) GetIds() []uint64 {
	if m != nil {
		return m.Ids
	}
	return nil
}

// Modes are a way of accumulating a small set of possible games that people can choose between
type Mode struct {
	// the config to be used for the game
	Config types.Config `protobuf:"bytes,1,opt,name=config,proto3" json:"config"`
	// the minimum amount of players needed to start a game
	Quorum uint32 `protobuf:"varint,2,opt,name=quorum,proto3" json:"quorum,omitempty"`
	// the max amount of players that can join the room
	Capacity uint32 `protobuf:"varint,3,opt,name=capacity,proto3" json:"capacity,omitempty"`
}

func (m *Mode) Reset()         { *m = Mode{} }
func (m *Mode) String() string { return proto.CompactTextString(m) }
func (*Mode) ProtoMessage()    {}
func (*Mode) Descriptor() ([]byte, []int) {
	return fileDescriptor_d29eb5cfff5372ca, []int{2}
}
func (m *Mode) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *Mode) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_Mode.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *Mode) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Mode.Merge(m, src)
}
func (m *Mode) XXX_Size() int {
	return m.Size()
}
func (m *Mode) XXX_DiscardUnknown() {
	xxx_messageInfo_Mode.DiscardUnknown(m)
}

var xxx_messageInfo_Mode proto.InternalMessageInfo

func (m *Mode) GetConfig() types.Config {
	if m != nil {
		return m.Config
	}
	return types.Config{}
}

func (m *Mode) GetQuorum() uint32 {
	if m != nil {
		return m.Quorum
	}
	return 0
}

func (m *Mode) GetCapacity() uint32 {
	if m != nil {
		return m.Capacity
	}
	return 0
}

type Params struct {
	// the maximum duration a room can last for before it is closed and all
	// players are kicked
	RoomLifespan time.Duration `protobuf:"bytes,1,opt,name=room_lifespan,json=roomLifespan,proto3,stdduration" json:"room_lifespan" yaml:"room_lifespan"`
	// the period betwee a quorum of players readying up and the start of the
	// game. This allows a few more players to join
	PrestartWaitPeriod time.Duration `protobuf:"bytes,2,opt,name=prestart_wait_period,json=prestartWaitPeriod,proto3,stdduration" json:"prestart_wait_period" yaml:"prestart_wait_period"`
}

func (m *Params) Reset()      { *m = Params{} }
func (*Params) ProtoMessage() {}
func (*Params) Descriptor() ([]byte, []int) {
	return fileDescriptor_d29eb5cfff5372ca, []int{3}
}
func (m *Params) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *Params) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_Params.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *Params) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Params.Merge(m, src)
}
func (m *Params) XXX_Size() int {
	return m.Size()
}
func (m *Params) XXX_DiscardUnknown() {
	xxx_messageInfo_Params.DiscardUnknown(m)
}

var xxx_messageInfo_Params proto.InternalMessageInfo

func (m *Params) GetRoomLifespan() time.Duration {
	if m != nil {
		return m.RoomLifespan
	}
	return 0
}

func (m *Params) GetPrestartWaitPeriod() time.Duration {
	if m != nil {
		return m.PrestartWaitPeriod
	}
	return 0
}

func init() {
	proto.RegisterType((*Room)(nil), "rook.matchmaker.Room")
	proto.RegisterType((*Rooms)(nil), "rook.matchmaker.Rooms")
	proto.RegisterType((*Mode)(nil), "rook.matchmaker.Mode")
	proto.RegisterType((*Params)(nil), "rook.matchmaker.Params")
}

func init() { proto.RegisterFile("rook/matchmaker/matchmaker.proto", fileDescriptor_d29eb5cfff5372ca) }

var fileDescriptor_d29eb5cfff5372ca = []byte{
	// 544 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x94, 0x53, 0xcf, 0x6b, 0xd4, 0x40,
	0x18, 0xcd, 0x34, 0x69, 0x76, 0x3b, 0x5a, 0xd4, 0x61, 0xd1, 0xe9, 0x0a, 0x49, 0xc8, 0xc5, 0x05,
	0x21, 0x01, 0xbd, 0x48, 0xf1, 0x20, 0xab, 0x82, 0x82, 0x42, 0x09, 0x82, 0xe0, 0x65, 0x9d, 0xcd,
	0x4c, 0xb3, 0xc3, 0x66, 0x76, 0xe2, 0x64, 0x42, 0xdd, 0xff, 0xa2, 0x78, 0xea, 0xb1, 0x7f, 0x4e,
	0x8f, 0x3d, 0x7a, 0x6a, 0x65, 0xf7, 0x22, 0x1e, 0xfd, 0x0b, 0x24, 0x93, 0xac, 0xdb, 0xfa, 0x8b,
	0x7a, 0x59, 0xe6, 0x7d, 0xef, 0x7b, 0xfb, 0xbe, 0x79, 0x5f, 0x06, 0x06, 0x4a, 0xca, 0x69, 0x2c,
	0x88, 0x4e, 0x27, 0x82, 0x4c, 0x99, 0xba, 0x70, 0x8c, 0x0a, 0x25, 0xb5, 0x44, 0x37, 0xea, 0x8e,
	0x68, 0x5d, 0xee, 0xf7, 0x32, 0x99, 0x49, 0xc3, 0xc5, 0xf5, 0xa9, 0x69, 0xeb, 0x7b, 0x99, 0x94,
	0x59, 0xce, 0x62, 0x83, 0xc6, 0xd5, 0x7e, 0x4c, 0x2b, 0x45, 0x34, 0x97, 0xb3, 0x96, 0xf7, 0x7f,
	0xe5, 0x35, 0x17, 0xac, 0xd4, 0x44, 0x14, 0x6d, 0x43, 0xcf, 0x4c, 0x92, 0x11, 0xc1, 0xcc, 0x4f,
	0x53, 0x0d, 0x3f, 0xd9, 0xd0, 0x49, 0xa4, 0x14, 0x28, 0x86, 0x6e, 0x2a, 0x67, 0xfb, 0x3c, 0xc3,
	0x20, 0x00, 0x83, 0x6b, 0x0f, 0x6e, 0x45, 0x66, 0x2e, 0xd3, 0xfa, 0xd4, 0x10, 0x43, 0xe7, 0xe4,
	0xcc, 0xb7, 0x92, 0xb6, 0x0d, 0x61, 0xd8, 0x29, 0x72, 0x32, 0x67, 0xaa, 0xc4, 0x1b, 0x81, 0x3d,
	0xd8, 0x4a, 0x56, 0xd0, 0x30, 0x6c, 0x46, 0xf9, 0x2c, 0xc3, 0x76, 0xcb, 0x34, 0x10, 0xdd, 0x86,
	0x6e, 0x51, 0x8d, 0x73, 0x9e, 0x62, 0x27, 0x00, 0x83, 0x6e, 0xd2, 0xa2, 0xba, 0xfe, 0xa1, 0x92,
	0xaa, 0x12, 0x78, 0x33, 0x00, 0x83, 0xed, 0xa4, 0x45, 0xa8, 0x0f, 0xbb, 0x29, 0x29, 0x48, 0xca,
	0xf5, 0x1c, 0xbb, 0x86, 0xf9, 0x89, 0xd1, 0x1d, 0xd8, 0x11, 0x92, 0xb2, 0x11, 0xa7, 0xb8, 0xd3,
	0x88, 0x6a, 0xf8, 0x92, 0xa2, 0xc7, 0xb0, 0x93, 0x2a, 0x46, 0x34, 0xa3, 0xb8, 0x6b, 0xae, 0xd2,
	0x8f, 0x9a, 0x6c, 0xa2, 0x55, 0x36, 0xd1, 0x9b, 0x55, 0x36, 0x43, 0xe7, 0xf0, 0xdc, 0x07, 0x2f,
	0xac, 0x64, 0x25, 0x41, 0x8f, 0xe0, 0xa6, 0x62, 0x84, 0xce, 0xf1, 0xd6, 0x95, 0xb5, 0x8d, 0x00,
	0x3d, 0x81, 0x5b, 0x65, 0x3a, 0x61, 0xb4, 0xca, 0x19, 0xc5, 0xf0, 0xca, 0xea, 0xb5, 0x68, 0xe8,
	0x42, 0xa7, 0xde, 0x5a, 0xb8, 0x03, 0x37, 0xeb, 0x9d, 0x94, 0xe8, 0x26, 0xb4, 0x39, 0x2d, 0x31,
	0x08, 0xec, 0x81, 0x93, 0xd4, 0xc7, 0x70, 0x0a, 0x9d, 0xd7, 0x92, 0xb2, 0xff, 0x5f, 0xd7, 0x3a,
	0xe2, 0x8d, 0xbf, 0x46, 0x6c, 0x5f, 0x8e, 0x38, 0xfc, 0x06, 0xa0, 0xbb, 0x47, 0x14, 0x11, 0x25,
	0x7a, 0x0f, 0xb7, 0x95, 0x94, 0x62, 0x94, 0xf3, 0x7d, 0x56, 0x16, 0x64, 0xd6, 0xda, 0xee, 0xfc,
	0x76, 0xc1, 0x67, 0xed, 0x67, 0x39, 0x0c, 0x6a, 0xfb, 0xef, 0x67, 0x7e, 0x6f, 0x4e, 0x44, 0xbe,
	0x1b, 0x5e, 0x52, 0x87, 0x47, 0xe7, 0x3e, 0x48, 0xae, 0xd7, 0xb5, 0x57, 0x6d, 0x09, 0x69, 0xd8,
	0x2b, 0x54, 0x9d, 0x8d, 0xd2, 0xa3, 0x03, 0xc2, 0xf5, 0xa8, 0x60, 0x8a, 0x4b, 0x6a, 0xc6, 0xfd,
	0xa7, 0xd1, 0xbd, 0xd6, 0xe8, 0x6e, 0x63, 0xf4, 0xa7, 0x3f, 0x69, 0xfc, 0xd0, 0x8a, 0x7a, 0x4b,
	0xb8, 0xde, 0x33, 0xc4, 0x6e, 0xf7, 0xe8, 0xd8, 0xb7, 0xbe, 0x1e, 0xfb, 0x60, 0xf8, 0xfc, 0x64,
	0xe1, 0x81, 0xd3, 0x85, 0x07, 0xbe, 0x2c, 0x3c, 0x70, 0xb8, 0xf4, 0xac, 0xd3, 0xa5, 0x67, 0x7d,
	0x5e, 0x7a, 0xd6, 0xbb, 0xfb, 0x19, 0xd7, 0x93, 0x6a, 0x1c, 0xa5, 0x52, 0xc4, 0xa9, 0x38, 0x20,
	0x9a, 0xa9, 0x32, 0x36, 0xaf, 0xe9, 0xe3, 0xc5, 0x97, 0xad, 0xe7, 0x05, 0x2b, 0xc7, 0xae, 0x19,
	0xf0, 0xe1, 0x8f, 0x00, 0x00, 0x00, 0xff, 0xff, 0xae, 0x7b, 0x3e, 0xf0, 0xf9, 0x03, 0x00, 0x00,
}

func (this *Params) Equal(that interface{}) bool {
	if that == nil {
		return this == nil
	}

	that1, ok := that.(*Params)
	if !ok {
		that2, ok := that.(Params)
		if ok {
			that1 = &that2
		} else {
			return false
		}
	}
	if that1 == nil {
		return this == nil
	} else if this == nil {
		return false
	}
	if this.RoomLifespan != that1.RoomLifespan {
		return false
	}
	if this.PrestartWaitPeriod != that1.PrestartWaitPeriod {
		return false
	}
	return true
}
func (m *Room) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *Room) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Room) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.Time != nil {
		{
			size := m.Time.Size()
			i -= size
			if _, err := m.Time.MarshalTo(dAtA[i:]); err != nil {
				return 0, err
			}
		}
	}
	if m.ModeId != 0 {
		i = encodeVarintMatchmaker(dAtA, i, uint64(m.ModeId))
		i--
		dAtA[i] = 0x38
	}
	if m.Capacity != 0 {
		i = encodeVarintMatchmaker(dAtA, i, uint64(m.Capacity))
		i--
		dAtA[i] = 0x30
	}
	if m.Quorum != 0 {
		i = encodeVarintMatchmaker(dAtA, i, uint64(m.Quorum))
		i--
		dAtA[i] = 0x28
	}
	if m.Public {
		i--
		if m.Public {
			dAtA[i] = 1
		} else {
			dAtA[i] = 0
		}
		i--
		dAtA[i] = 0x20
	}
	if len(m.Pending) > 0 {
		for iNdEx := len(m.Pending) - 1; iNdEx >= 0; iNdEx-- {
			i -= len(m.Pending[iNdEx])
			copy(dAtA[i:], m.Pending[iNdEx])
			i = encodeVarintMatchmaker(dAtA, i, uint64(len(m.Pending[iNdEx])))
			i--
			dAtA[i] = 0x1a
		}
	}
	if len(m.Players) > 0 {
		for iNdEx := len(m.Players) - 1; iNdEx >= 0; iNdEx-- {
			i -= len(m.Players[iNdEx])
			copy(dAtA[i:], m.Players[iNdEx])
			i = encodeVarintMatchmaker(dAtA, i, uint64(len(m.Players[iNdEx])))
			i--
			dAtA[i] = 0x12
		}
	}
	{
		size, err := m.Config.MarshalToSizedBuffer(dAtA[:i])
		if err != nil {
			return 0, err
		}
		i -= size
		i = encodeVarintMatchmaker(dAtA, i, uint64(size))
	}
	i--
	dAtA[i] = 0xa
	return len(dAtA) - i, nil
}

func (m *Room_Created) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Room_Created) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	if m.Created != nil {
		n2, err2 := github_com_gogo_protobuf_types.StdTimeMarshalTo(*m.Created, dAtA[i-github_com_gogo_protobuf_types.SizeOfStdTime(*m.Created):])
		if err2 != nil {
			return 0, err2
		}
		i -= n2
		i = encodeVarintMatchmaker(dAtA, i, uint64(n2))
		i--
		dAtA[i] = 0x42
	}
	return len(dAtA) - i, nil
}
func (m *Room_Ready) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Room_Ready) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	if m.Ready != nil {
		n3, err3 := github_com_gogo_protobuf_types.StdTimeMarshalTo(*m.Ready, dAtA[i-github_com_gogo_protobuf_types.SizeOfStdTime(*m.Ready):])
		if err3 != nil {
			return 0, err3
		}
		i -= n3
		i = encodeVarintMatchmaker(dAtA, i, uint64(n3))
		i--
		dAtA[i] = 0x4a
	}
	return len(dAtA) - i, nil
}
func (m *Room_Scheduled) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Room_Scheduled) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	if m.Scheduled != nil {
		n4, err4 := github_com_gogo_protobuf_types.StdTimeMarshalTo(*m.Scheduled, dAtA[i-github_com_gogo_protobuf_types.SizeOfStdTime(*m.Scheduled):])
		if err4 != nil {
			return 0, err4
		}
		i -= n4
		i = encodeVarintMatchmaker(dAtA, i, uint64(n4))
		i--
		dAtA[i] = 0x52
	}
	return len(dAtA) - i, nil
}
func (m *Rooms) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *Rooms) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Rooms) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.Ids) > 0 {
		dAtA6 := make([]byte, len(m.Ids)*10)
		var j5 int
		for _, num := range m.Ids {
			for num >= 1<<7 {
				dAtA6[j5] = uint8(uint64(num)&0x7f | 0x80)
				num >>= 7
				j5++
			}
			dAtA6[j5] = uint8(num)
			j5++
		}
		i -= j5
		copy(dAtA[i:], dAtA6[:j5])
		i = encodeVarintMatchmaker(dAtA, i, uint64(j5))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func (m *Mode) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *Mode) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Mode) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.Capacity != 0 {
		i = encodeVarintMatchmaker(dAtA, i, uint64(m.Capacity))
		i--
		dAtA[i] = 0x18
	}
	if m.Quorum != 0 {
		i = encodeVarintMatchmaker(dAtA, i, uint64(m.Quorum))
		i--
		dAtA[i] = 0x10
	}
	{
		size, err := m.Config.MarshalToSizedBuffer(dAtA[:i])
		if err != nil {
			return 0, err
		}
		i -= size
		i = encodeVarintMatchmaker(dAtA, i, uint64(size))
	}
	i--
	dAtA[i] = 0xa
	return len(dAtA) - i, nil
}

func (m *Params) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *Params) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Params) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	n8, err8 := github_com_gogo_protobuf_types.StdDurationMarshalTo(m.PrestartWaitPeriod, dAtA[i-github_com_gogo_protobuf_types.SizeOfStdDuration(m.PrestartWaitPeriod):])
	if err8 != nil {
		return 0, err8
	}
	i -= n8
	i = encodeVarintMatchmaker(dAtA, i, uint64(n8))
	i--
	dAtA[i] = 0x12
	n9, err9 := github_com_gogo_protobuf_types.StdDurationMarshalTo(m.RoomLifespan, dAtA[i-github_com_gogo_protobuf_types.SizeOfStdDuration(m.RoomLifespan):])
	if err9 != nil {
		return 0, err9
	}
	i -= n9
	i = encodeVarintMatchmaker(dAtA, i, uint64(n9))
	i--
	dAtA[i] = 0xa
	return len(dAtA) - i, nil
}

func encodeVarintMatchmaker(dAtA []byte, offset int, v uint64) int {
	offset -= sovMatchmaker(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *Room) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = m.Config.Size()
	n += 1 + l + sovMatchmaker(uint64(l))
	if len(m.Players) > 0 {
		for _, s := range m.Players {
			l = len(s)
			n += 1 + l + sovMatchmaker(uint64(l))
		}
	}
	if len(m.Pending) > 0 {
		for _, s := range m.Pending {
			l = len(s)
			n += 1 + l + sovMatchmaker(uint64(l))
		}
	}
	if m.Public {
		n += 2
	}
	if m.Quorum != 0 {
		n += 1 + sovMatchmaker(uint64(m.Quorum))
	}
	if m.Capacity != 0 {
		n += 1 + sovMatchmaker(uint64(m.Capacity))
	}
	if m.ModeId != 0 {
		n += 1 + sovMatchmaker(uint64(m.ModeId))
	}
	if m.Time != nil {
		n += m.Time.Size()
	}
	return n
}

func (m *Room_Created) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.Created != nil {
		l = github_com_gogo_protobuf_types.SizeOfStdTime(*m.Created)
		n += 1 + l + sovMatchmaker(uint64(l))
	}
	return n
}
func (m *Room_Ready) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.Ready != nil {
		l = github_com_gogo_protobuf_types.SizeOfStdTime(*m.Ready)
		n += 1 + l + sovMatchmaker(uint64(l))
	}
	return n
}
func (m *Room_Scheduled) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.Scheduled != nil {
		l = github_com_gogo_protobuf_types.SizeOfStdTime(*m.Scheduled)
		n += 1 + l + sovMatchmaker(uint64(l))
	}
	return n
}
func (m *Rooms) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if len(m.Ids) > 0 {
		l = 0
		for _, e := range m.Ids {
			l += sovMatchmaker(uint64(e))
		}
		n += 1 + sovMatchmaker(uint64(l)) + l
	}
	return n
}

func (m *Mode) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = m.Config.Size()
	n += 1 + l + sovMatchmaker(uint64(l))
	if m.Quorum != 0 {
		n += 1 + sovMatchmaker(uint64(m.Quorum))
	}
	if m.Capacity != 0 {
		n += 1 + sovMatchmaker(uint64(m.Capacity))
	}
	return n
}

func (m *Params) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = github_com_gogo_protobuf_types.SizeOfStdDuration(m.RoomLifespan)
	n += 1 + l + sovMatchmaker(uint64(l))
	l = github_com_gogo_protobuf_types.SizeOfStdDuration(m.PrestartWaitPeriod)
	n += 1 + l + sovMatchmaker(uint64(l))
	return n
}

func sovMatchmaker(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozMatchmaker(x uint64) (n int) {
	return sovMatchmaker(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *Room) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowMatchmaker
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: Room: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: Room: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Config", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthMatchmaker
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := m.Config.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Players", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthMatchmaker
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Players = append(m.Players, string(dAtA[iNdEx:postIndex]))
			iNdEx = postIndex
		case 3:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Pending", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthMatchmaker
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Pending = append(m.Pending, string(dAtA[iNdEx:postIndex]))
			iNdEx = postIndex
		case 4:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field Public", wireType)
			}
			var v int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				v |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			m.Public = bool(v != 0)
		case 5:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field Quorum", wireType)
			}
			m.Quorum = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.Quorum |= uint32(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 6:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field Capacity", wireType)
			}
			m.Capacity = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.Capacity |= uint32(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 7:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field ModeId", wireType)
			}
			m.ModeId = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.ModeId |= uint32(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 8:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Created", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthMatchmaker
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			v := new(time.Time)
			if err := github_com_gogo_protobuf_types.StdTimeUnmarshal(v, dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			m.Time = &Room_Created{v}
			iNdEx = postIndex
		case 9:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Ready", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthMatchmaker
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			v := new(time.Time)
			if err := github_com_gogo_protobuf_types.StdTimeUnmarshal(v, dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			m.Time = &Room_Ready{v}
			iNdEx = postIndex
		case 10:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Scheduled", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthMatchmaker
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			v := new(time.Time)
			if err := github_com_gogo_protobuf_types.StdTimeUnmarshal(v, dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			m.Time = &Room_Scheduled{v}
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipMatchmaker(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *Rooms) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowMatchmaker
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: Rooms: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: Rooms: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType == 0 {
				var v uint64
				for shift := uint(0); ; shift += 7 {
					if shift >= 64 {
						return ErrIntOverflowMatchmaker
					}
					if iNdEx >= l {
						return io.ErrUnexpectedEOF
					}
					b := dAtA[iNdEx]
					iNdEx++
					v |= uint64(b&0x7F) << shift
					if b < 0x80 {
						break
					}
				}
				m.Ids = append(m.Ids, v)
			} else if wireType == 2 {
				var packedLen int
				for shift := uint(0); ; shift += 7 {
					if shift >= 64 {
						return ErrIntOverflowMatchmaker
					}
					if iNdEx >= l {
						return io.ErrUnexpectedEOF
					}
					b := dAtA[iNdEx]
					iNdEx++
					packedLen |= int(b&0x7F) << shift
					if b < 0x80 {
						break
					}
				}
				if packedLen < 0 {
					return ErrInvalidLengthMatchmaker
				}
				postIndex := iNdEx + packedLen
				if postIndex < 0 {
					return ErrInvalidLengthMatchmaker
				}
				if postIndex > l {
					return io.ErrUnexpectedEOF
				}
				var elementCount int
				var count int
				for _, integer := range dAtA[iNdEx:postIndex] {
					if integer < 128 {
						count++
					}
				}
				elementCount = count
				if elementCount != 0 && len(m.Ids) == 0 {
					m.Ids = make([]uint64, 0, elementCount)
				}
				for iNdEx < postIndex {
					var v uint64
					for shift := uint(0); ; shift += 7 {
						if shift >= 64 {
							return ErrIntOverflowMatchmaker
						}
						if iNdEx >= l {
							return io.ErrUnexpectedEOF
						}
						b := dAtA[iNdEx]
						iNdEx++
						v |= uint64(b&0x7F) << shift
						if b < 0x80 {
							break
						}
					}
					m.Ids = append(m.Ids, v)
				}
			} else {
				return fmt.Errorf("proto: wrong wireType = %d for field Ids", wireType)
			}
		default:
			iNdEx = preIndex
			skippy, err := skipMatchmaker(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *Mode) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowMatchmaker
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: Mode: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: Mode: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Config", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthMatchmaker
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := m.Config.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 2:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field Quorum", wireType)
			}
			m.Quorum = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.Quorum |= uint32(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 3:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field Capacity", wireType)
			}
			m.Capacity = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.Capacity |= uint32(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		default:
			iNdEx = preIndex
			skippy, err := skipMatchmaker(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *Params) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowMatchmaker
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: Params: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: Params: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field RoomLifespan", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthMatchmaker
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := github_com_gogo_protobuf_types.StdDurationUnmarshal(&m.RoomLifespan, dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field PrestartWaitPeriod", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthMatchmaker
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := github_com_gogo_protobuf_types.StdDurationUnmarshal(&m.PrestartWaitPeriod, dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipMatchmaker(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthMatchmaker
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func skipMatchmaker(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowMatchmaker
			}
			if iNdEx >= l {
				return 0, io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= (uint64(b) & 0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		wireType := int(wire & 0x7)
		switch wireType {
		case 0:
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				iNdEx++
				if dAtA[iNdEx-1] < 0x80 {
					break
				}
			}
		case 1:
			iNdEx += 8
		case 2:
			var length int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowMatchmaker
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				length |= (int(b) & 0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if length < 0 {
				return 0, ErrInvalidLengthMatchmaker
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupMatchmaker
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthMatchmaker
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthMatchmaker        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowMatchmaker          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupMatchmaker = fmt.Errorf("proto: unexpected end of group")
)
