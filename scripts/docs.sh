#!/usr/bin/env bash

set -eo pipefail

# install node_modules if they don't exist yet
[ ! -d "docs/node_modules" ] && \
    cd docs && \
    npm install

# remove existing module specifications
rm -rf docs/src/spec/game
rm -rf docs/src/spec/matchmaker
rm -rf docs/src/spec/claim

# copy over module specifications from /x/
cp -r x/game/spec docs/src/spec/game
cp -r x/matchmaker/spec docs/src/spec/matchmaker
cp -r x/claim/spec docs/src/spec/claim

# build the docs
cd docs && npm run build