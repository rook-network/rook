import * as express from 'express';
import { StdFee, SigningStargateClient, isBroadcastTxSuccess } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { config } from 'dotenv';
import * as PouchDB from 'pouchdb';

type AccountModel = {
  _id: string
  _rev: string
  timestamp: number
}

const app = express();
let signer: SigningStargateClient
let address: string
const cooldown = process.env.FAUCET_AMOUNT !== "" ? parseInt(process.env.FAUCET_COOLDOWN_SECONDS) : 60*60*24
const amount = process.env.FAUCET_AMOUNT !== "" ? parseInt(process.env.FAUCET_AMOUNT) : 1000000
const prefix = process.env.FAUCET_CHAIN_PREFIX
const defaultFee: StdFee = {
  amount: [],
  gas: "100000"
}
const db = new PouchDB('faucet-db')


app.get('/status', async (req, res) => {
  if (signer === undefined) {
    return res.send({ error: "account not connected"})
  }
  const balance = await signer.getAllBalances(address)
  return res.send({ 
    address: address, 
    chain_id: await signer.getChainId(),
    total_faucet_amount: balance,
    claimable_amount: amount,
    faucet_cooldown: cooldown,
  });
});

app.get('/brrr/:address', async (req, res) => {
  const recipient = req.params.address
  if (recipient.substr(0, prefix.length) !== prefix) {
    return res.send({ error: "Invalid address: incorrect prefix" })
  }

  if (address.length !== recipient.length) {
    return res.send({ error: "Invalid address: incorrect length"})
  }

  const currentTime = now()
  let data: AccountModel
  try {
    data = await db.get<AccountModel>(recipient)
    if ((data.timestamp + cooldown) > currentTime) {
      const remainingTime = (data.timestamp + cooldown) - currentTime
      return res.send({ error: "Address still needs to wait " + remainingTime + " seconds before claiming from the faucet again"})
    }
  } catch (err) {
    if (err.status !== 404) {
      return res.send({ error: err })
    }
  }

  const balances = await signer.getAllBalances(address)
  const enough = checkBalance(balances, amount)
  if (!enough) {
    return res.send({ error: "Faucet has been completely drained"})
  }

  const token = [{
    amount: amount.toString(),
    denom: process.env.FAUCET_DENOM
  }]

  try {
    const resp = await signer.sendTokens(address, recipient.toString(), token, defaultFee)
    if (isBroadcastTxSuccess(resp)) {
      try {
        await db.put<AccountModel>({
          _id: recipient,
          _rev: data._rev,
          timestamp: currentTime
        })
      } catch (err) {
        console.error(err)
        return res.status(500).send()
      }
      res.send({ message: 'Successfully collected ' + amount + ' ' + prefix + ' tokens from the faucet.' });
    } else {
      res.send({ error: "Failed to broadcast tx: " + resp.rawLog})
    }
  } catch(err) {
    console.error(err)
    res.send({ error: "Error broadcasting tx: " + err })
  }
});

config()

const port = process.env.PORT || 8000;
const server = app.listen(port, async () => {
  try {
    await init()
  } catch (err) {
    console.error(err)
  }
});
server.on('error', console.error);


async function init() {
  if (prefix === undefined) {
    throw new Error('FAUCET_CHAIN_PREFIX must be defined')
  }

  if (process.env.FAUCET_DENOM === undefined) {
    throw new Error('FAUCET_DENOM must be defined')
  }

  if (process.env.FAUCET_MNEMONIC === undefined) {
    throw new Error('FAUCET_MNEMONIC must be defined')
  }

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.FAUCET_MNEMONIC, { prefix: prefix})
  signer = await SigningStargateClient.connectWithSigner(
    process.env.FAUCET_RPC,
    wallet
  )
  
  // get the first account as the address
  const account = await wallet.getAccounts()
  address = account[0].address

  const balances = await signer.getAllBalances(address)
  const exists = checkBalance(balances)
  if (!exists) {
    throw new Error("account " + address + " doesn't contain any " + process.env.FAUCET_DENOM + " tokens.")
  }

  console.log(`Starting faucet on http://localhost:${port} with address: ${address}`);

}

function now(): number {
  return Math.floor(Date.now()/1000);
}

interface Coin {
  denom: string,
  amount: string
}

function checkBalance(balances: readonly Coin[], min = 1): boolean {
  let exists = false
  for (const balance of balances) {
    if (balance.denom === process.env.FAUCET_DENOM && parseInt(balance.amount) >= min) {
      exists = true
    }
  }
  return exists
}