export type IBlockchainIdent = "eth" | "neo" | "eos" | "btc"
export interface IWallet
{
	blockchain: IBlockchainIdent
	address: string
	chainId: number | string
}
export interface IEthTransferTxRequest
{
	to: string
	nonce: number
	gasPrice: string
	value: string
	// data: string // hard-coded for value transfers
	// gasLimit: string // hard-coded for value transfers
	// from: string // can be determined from wallet
	// chainId: number // can be determined from wallet
}
export type IWalletWithPk = { wallet: IWallet, pk: string }
export type IWalletStorage = { [key in IBlockchainIdent]?: IWalletWithPk[] }
