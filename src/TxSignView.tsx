import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { IWallet, IEthTransferTxRequest, IWalletStorage } from './interfaces'
import { getPk } from './WalletStorage'
import { Buffer } from "buffer"
import EthTx from "ethereumjs-tx"

export interface TxSignViewProps
{
	onCancel: () => void
	onSign: (signedTx: string) => void
	tx: IEthTransferTxRequest
	wallet: IWallet
	wallets: IWalletStorage
}

export interface TxSignViewState
{
	checkedValue?: boolean
	checkedTo?: boolean
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
		let buf = new Buffer(pk, 'hex')
		console.log(buf)
		console.log(`buffer length: ${buf.length}`)
		etx.sign(buf)
		let signedTx = '0x' + etx.serialize().toString('hex')
		// let signedTx = '--'
		console.log(signedTx)

		this.props.onSign(signedTx)
	}
	render()
	{
		return (
			<View style={ styles.container }>
				<Text>{`raw: ${this.props.tx}`}</Text>
				<Text>To: { this.props.tx.to }</Text>
				<Text>Gas price: { this.props.tx.gasPrice }</Text>
				<Text>Nonce: { this.props.tx.nonce }</Text>
				<Text>Value: { this.props.tx.value }</Text>
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
