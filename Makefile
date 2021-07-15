#!/usr/bin/make -f

PACKAGES_SIMTEST=$(shell go list ./... | grep '/simulation')
VERSION := $(shell echo $(shell git describe --tags) | sed 's/^v//')
COMMIT := $(shell git log -1 --format='%H')
LEDGER_ENABLED ?= true
SDK_PACK := $(shell go list -m github.com/cosmos/cosmos-sdk | sed  's/ /\@/g')
DOCKER := $(shell which docker)
BUILDDIR ?= $(CURDIR)/build
TEST_DOCKER_REPO=cmwaters/rook

export GO111MODULE = on

# process build tags

build_tags = netgo
ifeq ($(LEDGER_ENABLED),true)
  ifeq ($(OS),Windows_NT)
    GCCEXE = $(shell where gcc.exe 2> NUL)
    ifeq ($(GCCEXE),)
      $(error gcc.exe not installed for ledger support, please install or set LEDGER_ENABLED=false)
    else
      build_tags += ledger
    endif
  else
    UNAME_S = $(shell uname -s)
    ifeq ($(UNAME_S),OpenBSD)
      $(warning OpenBSD detected, disabling ledger support (https://github.com/cosmos/cosmos-sdk/issues/1988))
    else
      GCC = $(shell command -v gcc 2> /dev/null)
      ifeq ($(GCC),)
        $(error gcc not installed for ledger support, please install or set LEDGER_ENABLED=false)
      else
        build_tags += ledger
      endif
    endif
  endif
endif

ifeq (cleveldb,$(findstring cleveldb,$(ROOK_BUILD_OPTIONS)))
  build_tags += gcc
endif
build_tags += $(BUILD_TAGS)
build_tags := $(strip $(build_tags))

whitespace :=
whitespace += $(whitespace)
comma := ,
build_tags_comma_sep := $(subst $(whitespace),$(comma),$(build_tags))

# process linker flags

ldflags = -X github.com/cosmos/cosmos-sdk/version.Name=rook \
		  -X github.com/cosmos/cosmos-sdk/version.AppName=rook \
		  -X github.com/cosmos/cosmos-sdk/version.Version=$(VERSION) \
		  -X github.com/cosmos/cosmos-sdk/version.Commit=$(COMMIT) \
		  -X "github.com/cosmos/cosmos-sdk/version.BuildTags=$(build_tags_comma_sep)"

ifeq (cleveldb,$(findstring cleveldb,$(ROOK_BUILD_OPTIONS)))
  ldflags += -X github.com/cosmos/cosmos-sdk/types.DBBackend=cleveldb
endif
ifeq (,$(findstring nostrip,$(ROOK_BUILD_OPTIONS)))
  ldflags += -w -s
endif
ldflags += $(LDFLAGS)
ldflags := $(strip $(ldflags))

BUILD_FLAGS := -tags "$(build_tags)" -ldflags '$(ldflags)'
# check for nostrip option
ifeq (,$(findstring nostrip,$(ROOK_BUILD_OPTIONS)))
  BUILD_FLAGS += -trimpath
endif

# The below include contains the tools target.
include contrib/devtools/Makefile

###############################################################################
###                                  Build                                  ###
###############################################################################

all: install lint test

BUILD_TARGETS := build install

build: BUILD_ARGS=-o $(BUILDDIR)/
build-linux:
	GOOS=linux GOARCH=amd64 LEDGER_ENABLED=false $(MAKE) build

$(BUILD_TARGETS): go.sum $(BUILDDIR)/
	go $@ -mod=readonly $(BUILD_FLAGS) $(BUILD_ARGS) ./...

$(BUILDDIR)/:
	mkdir -p $(BUILDDIR)/

build-rook-all: go.sum
	$(if $(shell docker inspect -f '{{ .Id }}' tendermint/xrnnode 2>/dev/null),$(info found image tendermint/xrnnode),docker pull tendermint/xrnnode:latest)
	docker rm latest-build || true
	docker run --volume=$(CURDIR):/sources:ro \
        --env TARGET_OS='darwin linux windows' \
        --env APP=rook \
        --env VERSION=$(VERSION) \
        --env COMMIT=$(COMMIT) \
        --env LEDGER_ENABLED=$(LEDGER_ENABLED) \
        --name latest-build tendermint/xrnnode:latest
	docker cp -a latest-build:/home/builder/artifacts/ $(CURDIR)/

build-rook-linux: go.sum $(BUILDDIR)/
	$(if $(shell docker inspect -f '{{ .Id }}' tendermint/xrnnode 2>/dev/null),$(info found image tendermint/xrnnode),docker pull tendermint/xrnnode:latest)
	docker rm latest-build || true
	docker run --volume=$(CURDIR):/sources:ro \
        --env TARGET_OS='linux' \
        --env APP=rook \
        --env VERSION=$(VERSION) \
        --env COMMIT=$(COMMIT) \
        --env LEDGER_ENABLED=false \
        --name latest-build tendermint/xrnnode:latest
	docker cp -a latest-build:/home/builder/artifacts/ $(CURDIR)/
	cp artifacts/rook-*-linux-amd64 $(BUILDDIR)/rook

.PHONY: build build-linux build-rook-all build-rook-linux

mockgen_cmd=go run github.com/golang/mock/mockgen

mocks: $(MOCKS_DIR)
	$(mockgen_cmd) -source=client/account_retriever.go -package mocks -destination tests/mocks/account_retriever.go
	$(mockgen_cmd) -package mocks -destination tests/mocks/tendermint_tm_db_DB.go github.com/tendermint/tm-db DB
	$(mockgen_cmd) -source=types/module/module.go -package mocks -destination tests/mocks/types_module_module.go
	$(mockgen_cmd) -source=types/invariant.go -package mocks -destination tests/mocks/types_invariant.go
	$(mockgen_cmd) -source=types/router.go -package mocks -destination tests/mocks/types_router.go
	$(mockgen_cmd) -package mocks -destination tests/mocks/grpc_server.go github.com/gogo/protobuf/grpc Server
	$(mockgen_cmd) -package mocks -destination tests/mocks/tendermint_tendermint_libs_log_DB.go github.com/tendermint/tendermint/libs/log Logger
.PHONY: mocks

$(MOCKS_DIR):
	mkdir -p $(MOCKS_DIR)

distclean: clean tools-clean
clean:
	rm -rf \
    $(BUILDDIR)/ \
    artifacts/ \
    tmp-swagger-gen/

.PHONY: distclean clean


###############################################################################
###                                Protobuf                                 ###
###############################################################################

proto-all: proto-gen proto-lint proto-check-breaking
.PHONY: proto-all

proto-gen:
	@docker pull -q tendermintdev/docker-build-proto
	@echo "Generating Protobuf files"
	@docker run -v $(shell pwd):/workspace --workdir /workspace tendermintdev/docker-build-proto sh ./scripts/protocgen.sh
.PHONY: proto-gen

proto-lint:
	@$(DOCKER_BUF) check lint --error-format=json
.PHONY: proto-lint

proto-format:
	@echo "Formatting Protobuf files"
	docker run -v $(shell pwd):/workspace --workdir /workspace tendermintdev/docker-build-proto find ./ -not -path "./third_party/*" -name *.proto -exec clang-format -i {} \;
.PHONY: proto-format

proto-check-breaking:
	@$(DOCKER_BUF) check breaking --against-input .git#branch=master
.PHONY: proto-check-breaking
