# Nodes

Nodes are the individual processes at the core of network that allow for players to compete and enjoy Rook. This section will provide a guide to setting up your own node and how you can even play the game locally.

## Server Configuration

If you are running of a fresh linux server, we will need to set up the environment first. Create a new user

```bash
adduser <username>
usermod -aG sudo <username>
su - <username>
```

Update the system and install dependencies

```bash
# Update the system
sudo apt update
sudo apt upgrade

# Install dependencies
sudo apt install git build-essential ufw curl snapd --yes
sudo snap install go --classic

# Export environment variables
echo 'export GOPATH="$HOME/go"' >> ~/.profile
echo 'export GOBIN="$GOPATH/bin"' >> ~/.profile
echo 'export PATH="$GOBIN:$PATH"' >> ~/.profile
source ~/.profile

# Check go is correctly configured
go version
```

## Installing and Initializing Rook

Clone the respository and build the binary

```bash
git clone https://github.com/cmwaters/rook
cd rook
git checkout v0.1.0  # make sure you have the correct version
make install

# check rook has been installed
rook version
```

Initialise your node

```bash
# check that you are using the right chain id. This will change over different testnets/mainnets
# If you want to run on your own chain then you can use 
rook init --chain-id rook-1 <your_moniker>
```

Start the node

```bash
rook start
```

*More details to follow*
