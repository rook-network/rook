export const ErrKeplrNotEnabled = new Error('Keplr not enabled')
export const ErrUnableToSuggestChain = (err: string) => {
    return new Error('Unable to suggest Rook chain to Keplr: ' + err)
}
export const ErrNodeNotConnected = (endpoint: string) => {
    return new Error('Unable to connect with node on ' + endpoint)
}
export const ErrNoAccount = new Error("You have no accounts")