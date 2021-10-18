// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: rook/claim/tx.proto

package types

import (
	context "context"
	fmt "fmt"
	types "github.com/cosmos/cosmos-sdk/types"
	_ "github.com/gogo/protobuf/gogoproto"
	grpc1 "github.com/gogo/protobuf/grpc"
	proto "github.com/gogo/protobuf/proto"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	io "io"
	math "math"
	math_bits "math/bits"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion3 // please upgrade the proto package

type MsgActivate struct {
	Claimee string `protobuf:"bytes,1,opt,name=claimee,proto3" json:"claimee,omitempty"`
}

func (m *MsgActivate) Reset()         { *m = MsgActivate{} }
func (m *MsgActivate) String() string { return proto.CompactTextString(m) }
func (*MsgActivate) ProtoMessage()    {}
func (*MsgActivate) Descriptor() ([]byte, []int) {
	return fileDescriptor_5582dedaaf892b32, []int{0}
}
func (m *MsgActivate) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *MsgActivate) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_MsgActivate.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *MsgActivate) XXX_Merge(src proto.Message) {
	xxx_messageInfo_MsgActivate.Merge(m, src)
}
func (m *MsgActivate) XXX_Size() int {
	return m.Size()
}
func (m *MsgActivate) XXX_DiscardUnknown() {
	xxx_messageInfo_MsgActivate.DiscardUnknown(m)
}

var xxx_messageInfo_MsgActivate proto.InternalMessageInfo

func (m *MsgActivate) GetClaimee() string {
	if m != nil {
		return m.Claimee
	}
	return ""
}

type MsgActivateResponse struct {
	// The first installment earned from activating the airdrop
	Claimed types.Coin `protobuf:"bytes,2,opt,name=claimed,proto3" json:"claimed" yaml:"claimed"`
}

func (m *MsgActivateResponse) Reset()         { *m = MsgActivateResponse{} }
func (m *MsgActivateResponse) String() string { return proto.CompactTextString(m) }
func (*MsgActivateResponse) ProtoMessage()    {}
func (*MsgActivateResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_5582dedaaf892b32, []int{1}
}
func (m *MsgActivateResponse) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *MsgActivateResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_MsgActivateResponse.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *MsgActivateResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_MsgActivateResponse.Merge(m, src)
}
func (m *MsgActivateResponse) XXX_Size() int {
	return m.Size()
}
func (m *MsgActivateResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_MsgActivateResponse.DiscardUnknown(m)
}

var xxx_messageInfo_MsgActivateResponse proto.InternalMessageInfo

func (m *MsgActivateResponse) GetClaimed() types.Coin {
	if m != nil {
		return m.Claimed
	}
	return types.Coin{}
}

func init() {
	proto.RegisterType((*MsgActivate)(nil), "rook.claim.MsgActivate")
	proto.RegisterType((*MsgActivateResponse)(nil), "rook.claim.MsgActivateResponse")
}

func init() { proto.RegisterFile("rook/claim/tx.proto", fileDescriptor_5582dedaaf892b32) }

var fileDescriptor_5582dedaaf892b32 = []byte{
	// 286 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x12, 0x2e, 0xca, 0xcf, 0xcf,
	0xd6, 0x4f, 0xce, 0x49, 0xcc, 0xcc, 0xd5, 0x2f, 0xa9, 0xd0, 0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17,
	0xe2, 0x02, 0x09, 0xea, 0x81, 0x05, 0xa5, 0x44, 0xd2, 0xf3, 0xd3, 0xf3, 0xc1, 0xc2, 0xfa, 0x20,
	0x16, 0x44, 0x85, 0x94, 0x5c, 0x72, 0x7e, 0x71, 0x6e, 0x7e, 0xb1, 0x7e, 0x52, 0x62, 0x71, 0xaa,
	0x7e, 0x99, 0x61, 0x52, 0x6a, 0x49, 0xa2, 0xa1, 0x7e, 0x72, 0x7e, 0x66, 0x1e, 0x44, 0x5e, 0x49,
	0x9d, 0x8b, 0xdb, 0xb7, 0x38, 0xdd, 0x31, 0xb9, 0x24, 0xb3, 0x2c, 0xb1, 0x24, 0x55, 0x48, 0x82,
	0x8b, 0x1d, 0x6c, 0x5a, 0x6a, 0xaa, 0x04, 0xa3, 0x02, 0xa3, 0x06, 0x67, 0x10, 0x8c, 0xab, 0x94,
	0xc4, 0x25, 0x8c, 0xa4, 0x30, 0x28, 0xb5, 0xb8, 0x20, 0x3f, 0xaf, 0x38, 0x55, 0xc8, 0x1b, 0xa6,
	0x21, 0x45, 0x82, 0x49, 0x81, 0x51, 0x83, 0xdb, 0x48, 0x52, 0x0f, 0x62, 0xa3, 0x1e, 0xc8, 0x46,
	0x3d, 0xa8, 0x8d, 0x7a, 0xce, 0xf9, 0x99, 0x79, 0x4e, 0x62, 0x27, 0xee, 0xc9, 0x33, 0x7c, 0xba,
	0x27, 0xcf, 0x57, 0x99, 0x98, 0x9b, 0x63, 0xa5, 0x04, 0xd5, 0xa7, 0x04, 0xb3, 0x23, 0xc5, 0xc8,
	0x9b, 0x8b, 0xd9, 0xb7, 0x38, 0x5d, 0xc8, 0x85, 0x8b, 0x03, 0xee, 0x20, 0x71, 0x3d, 0x84, 0x17,
	0xf5, 0x90, 0x1c, 0x20, 0x25, 0x8f, 0x43, 0x02, 0xe6, 0x32, 0x27, 0xb7, 0x13, 0x8f, 0xe4, 0x18,
	0x2f, 0x3c, 0x92, 0x63, 0x7c, 0xf0, 0x48, 0x8e, 0x71, 0xc2, 0x63, 0x39, 0x86, 0x0b, 0x8f, 0xe5,
	0x18, 0x6e, 0x3c, 0x96, 0x63, 0x88, 0xd2, 0x49, 0xcf, 0x2c, 0xc9, 0x28, 0x4d, 0xd2, 0x4b, 0xce,
	0xcf, 0xd5, 0x4f, 0x2c, 0x4a, 0x4e, 0xcc, 0x4b, 0xd5, 0x2d, 0xae, 0x2c, 0x2e, 0x49, 0xcd, 0x2d,
	0xd6, 0x07, 0x07, 0x72, 0x05, 0x2c, 0x98, 0x2b, 0x0b, 0x52, 0x8b, 0x93, 0xd8, 0xc0, 0x01, 0x65,
	0x0c, 0x08, 0x00, 0x00, 0xff, 0xff, 0x54, 0x9d, 0xd1, 0x0a, 0x81, 0x01, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// MsgClient is the client API for Msg service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type MsgClient interface {
	Activate(ctx context.Context, in *MsgActivate, opts ...grpc.CallOption) (*MsgActivateResponse, error)
}

type msgClient struct {
	cc grpc1.ClientConn
}

func NewMsgClient(cc grpc1.ClientConn) MsgClient {
	return &msgClient{cc}
}

func (c *msgClient) Activate(ctx context.Context, in *MsgActivate, opts ...grpc.CallOption) (*MsgActivateResponse, error) {
	out := new(MsgActivateResponse)
	err := c.cc.Invoke(ctx, "/rook.claim.Msg/Activate", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// MsgServer is the server API for Msg service.
type MsgServer interface {
	Activate(context.Context, *MsgActivate) (*MsgActivateResponse, error)
}

// UnimplementedMsgServer can be embedded to have forward compatible implementations.
type UnimplementedMsgServer struct {
}

func (*UnimplementedMsgServer) Activate(ctx context.Context, req *MsgActivate) (*MsgActivateResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Activate not implemented")
}

func RegisterMsgServer(s grpc1.Server, srv MsgServer) {
	s.RegisterService(&_Msg_serviceDesc, srv)
}

func _Msg_Activate_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgActivate)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).Activate(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rook.claim.Msg/Activate",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).Activate(ctx, req.(*MsgActivate))
	}
	return interceptor(ctx, in, info, handler)
}

var _Msg_serviceDesc = grpc.ServiceDesc{
	ServiceName: "rook.claim.Msg",
	HandlerType: (*MsgServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Activate",
			Handler:    _Msg_Activate_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "rook/claim/tx.proto",
}

func (m *MsgActivate) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *MsgActivate) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *MsgActivate) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.Claimee) > 0 {
		i -= len(m.Claimee)
		copy(dAtA[i:], m.Claimee)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Claimee)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func (m *MsgActivateResponse) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *MsgActivateResponse) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *MsgActivateResponse) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	{
		size, err := m.Claimed.MarshalToSizedBuffer(dAtA[:i])
		if err != nil {
			return 0, err
		}
		i -= size
		i = encodeVarintTx(dAtA, i, uint64(size))
	}
	i--
	dAtA[i] = 0x12
	return len(dAtA) - i, nil
}

func encodeVarintTx(dAtA []byte, offset int, v uint64) int {
	offset -= sovTx(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *MsgActivate) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Claimee)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	return n
}

func (m *MsgActivateResponse) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = m.Claimed.Size()
	n += 1 + l + sovTx(uint64(l))
	return n
}

func sovTx(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozTx(x uint64) (n int) {
	return sovTx(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *MsgActivate) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowTx
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
			return fmt.Errorf("proto: MsgActivate: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: MsgActivate: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Claimee", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
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
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Claimee = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipTx(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthTx
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
func (m *MsgActivateResponse) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowTx
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
			return fmt.Errorf("proto: MsgActivateResponse: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: MsgActivateResponse: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Claimed", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
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
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := m.Claimed.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipTx(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthTx
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
func skipTx(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowTx
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
					return 0, ErrIntOverflowTx
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
					return 0, ErrIntOverflowTx
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
				return 0, ErrInvalidLengthTx
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupTx
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthTx
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthTx        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowTx          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupTx = fmt.Errorf("proto: unexpected end of group")
)