#!/bin/bash

# move to home directory
cd $HOME

# delete previous reference of rook
rm -rf .rook

# initialize your node
rook init my-node --chain-id rook-single

# add the keys for account
rook keys add my-account

rook add-genesis-account $(rook keys show my-account -a) 1000000000urook

# Generate the transaction that creates your validator
rook gentx my-account 100000000urook --chain-id rook-single

# Add the generated bonding transaction to the genesis file
rook collect-gentxs

# change the denom from stake to urook
sed -i -e "s/stake/urook/g" $HOME/.rook/config/genesis.json

# Now start rook
# rook start