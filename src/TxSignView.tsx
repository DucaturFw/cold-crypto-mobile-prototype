import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { IWallet, IEthTransferTxRequest, IWalletStorage } from './interfaces'
import { getPk } from './WalletStorage'
import { Buffer } from "buffer"
import EthTx from "ethereumjs-tx"
import unsignTx from "@warren-bank/ethereumjs-tx-unsign"
import BN from "bn.js"

export interface TxSignViewProps
{
	onCancel: () => void
	onSign: (msgid: string | number | null, signedTx: string) => void
	tx: IEthTransferTxRequest
	wallet: IWallet
	wallets: IWalletStorage
	msgid: string | number | null
}

export interface TxSignViewState
{
	checkedValue?: boolean
	checkedTo?: boolean
}

export function toHex(num: string): string
{
	console.log(`pre-hex: ${num}`)
	let bn = '0x' + new BN(num).toString('hex')
	console.log(`post-hex: ${bn}`)
	return bn
}

export default class TxSignView extends React.Component<TxSignViewProps, TxSignViewState>
{
	constructor(props: TxSignViewProps)
	{
		super(props)
	}
	onSignButton = async () =>
	{
		let tx = {
			...this.props.tx,
			value: toHex(this.props.tx.value),
			gasPrice: toHex(this.props.tx.gasPrice),
			nonce: toHex(this.props.tx.nonce.toString()),
			from: this.props.wallet.address,
			gasLimit: "0x5208",
			data: '0x',
			chainId: this.props.wallet.chainId
		}
		// tx signing magic goes here
		// ...
		let pk = getPk(this.props.wallets, this.props.wallet)
		if (!pk)
			return console.error(`private key not found for wallet <${this.props.wallet.blockchain}/${this.props.wallet.chainId}/${this.props.wallet.address}>!\n${JSON.stringify(this.props.wallets)}`)
		
		let etx = new EthTx(tx)
		console.log(tx)
		let buf = new Buffer(pk, 'hex')
		console.log(buf)
		console.log(`buffer length: ${buf.length}`)
		etx.sign(buf)
		let signedTx = '0x' + etx.serialize().toString('hex')
		// let signedTx = '--'
		console.log(signedTx)
		console.log(unsignTx(signedTx))

		this.props.onSign(this.props.msgid, signedTx)
	}
	render()
	{
		return (
			<View style={ styles.container }>
				<Text>{`raw: ${this.props.tx}`}</Text>
				<Text>To: { this.props.tx.to }</Text>
				<Text>Gas price: { this.props.tx.gasPrice } ({ parseInt(this.props.tx.gasPrice) * 21000 / 1e18 } ETH)</Text>
				<Text>Nonce: { this.props.tx.nonce }</Text>
				<Text>Value: { parseInt(this.props.tx.value) / 1e18 } ETH</Text>
				<Button title="Sign" onPress={this.onSignButton}></Button>
				<Button title="Cancel" onPress={this.props.onCancel}></Button>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
})
