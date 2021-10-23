#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

# make sure the version matches that of go.mod
COSMOS_SDK_VERSION="v0.44.3"
PROTO_DIR="./third-party"
COSMOS_DIR="$PROTO_DIR/cosmos"
COSMOS_SDK_DIR="$COSMOS_DIR/cosmos-sdk"
ZIP_FILE="$COSMOS_DIR/tmp.zip"
COSMOS_SDK_REF=${COSMOS_SDK_VERSION:-"master"}
SUFFIX=${COSMOS_SDK_REF}

[[ $SUFFIX =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-.+)?$ ]] && SUFFIX=${SUFFIX#v}

mkdir -p "$COSMOS_DIR"

wget -qO "$ZIP_FILE" "https://github.com/cosmos/cosmos-sdk/archive/$COSMOS_SDK_REF.zip"
unzip "$ZIP_FILE" "*.proto" -d "$COSMOS_DIR"
mv "$COSMOS_SDK_DIR-$SUFFIX" "$COSMOS_SDK_DIR"
rm "$ZIP_FILE"

PROTOBUF_URL="https://raw.githubusercontent.com/protocolbuffers/protobuf/master/src/google/protobuf"
curl -sSL $PROTOBUF_URL/descriptor.proto > $COSMOS_SDK_DIR/third_party/proto/google/protobuf/descriptor.proto
curl -sSL $PROTOBUF_URL/timestamp.proto > $COSMOS_SDK_DIR/third_party/proto/google/protobuf/timestamp.proto
curl -sSL $PROTOBUF_URL/duration.proto > $COSMOS_SDK_DIR/third_party/proto/google/protobuf/duration.proto