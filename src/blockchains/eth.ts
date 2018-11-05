import { IHexString, IBlockchain, IFullAccount, ISignature } from "./interfaces"
import EthTx from "ethereumjs-tx"
import Wallet from "ethereumjs-wallet"
import { Buffer } from "buffer"

export interface ITransaction
{
	to: IHexString
	nonce: IHexString
	gasPrice: IHexString
	value: IHexString
	from: IHexString
	gasLimit: IHexString
	data: IHexString
	chainId: number | string
}
export function signTx(tx: ITransaction, privateKey: IHexString): IHexString
{
	let etx = new EthTx(tx)
	console.log(tx)
	let buf = new Buffer(privateKey, 'hex')
	console.log(buf)
	console.log(`buffer length: ${buf.length}`)
	etx.sign(buf)
	let signedTx = '0x' + etx.serialize().toString('hex')
	// let signedTx = '--'
	console.log(signedTx)
	return signedTx
}
export function privateKeyToAccount(privateKey: IHexString, opts?: {}): IFullAccount
{
	let address = Wallet.fromPrivateKey(Buffer.from(privateKey, 'hex')).getChecksumAddressString()
	return {
		address,
		privateKey,
	}
}