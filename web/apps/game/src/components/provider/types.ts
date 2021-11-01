import { StdFee } from '@cosmjs/stargate'
import config from '../../config'

export const defaultFee: StdFee = {
    amount: [
        { 
            denom: config.coinDenom,
            amount: "0",
        }
    ],
    gas: "100000"
}