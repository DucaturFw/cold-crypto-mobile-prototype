import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { IWallet, IEthTransferTxRequest } from './interfaces'

export interface TxSignViewProps
{
	onCancel: () => void
	onSign: (signedTx: string) => void
	tx: IEthTransferTxRequest
	wallet: IWallet
}

export default class TxSignView extends React.Component<TxSignViewProps>
{
	state = {
		checkedValue: false,
		checkedTo: false,
	}
	onSignButton = () =>
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
		let signedTx = '0xededededededed123456812345678'

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
