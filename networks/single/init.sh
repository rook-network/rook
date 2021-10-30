#!/bin/bash

set -eo pipefail

test_accounts=$(cat accounts.json | jq -c)
echo "${test_accounts}" | jq -r '.[] | @base64'

# move to home directory
cd $HOME

# delete previous reference of rook
rm -rf .rook

# initialize your node
rook init my-node --chain-id rook-single

# add the keys for account
rook keys add my-account

# create a genesis account
rook add-genesis-account $(rook keys show my-account -a) 1000000000urook

# create test accounts from accounts.json
for account in $(echo "${test_accounts}" | jq -r '.[] | @base64'); do 
    _info() { 
        echo $account | base64 --decode | jq -r ${1}
    }
    echo "creating test account"
    rook add-genesis-account $(_info '.address') $(_info '.amount')
done

# Generate the transaction that creates your validator
rook gentx my-account 100000000urook --chain-id rook-single

# Add the generated bonding transaction to the genesis file
rook collect-gentxs

# change the denom from stake to urook
sed -i -e "s/stake/urook/g" $HOME/.rook/config/genesis.json

# allor cors from any origin
sed -i -e 's/\[\]/\["*"\]/g' $HOME/.rook/config/config.toml

# Now start rook
# rook start