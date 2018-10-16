import React, { ReactInstance } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import CameraView from './CameraView'
import TxSignView from './TxSignView'
import { parseHostCommand, allToObj, allToArray } from './HostProtocol'
import { IWallet, IEthTransferTxRequest, IWalletStorage } from './interfaces'
import QRCode from 'react-native-qrcode'
import { ethWallet } from './WalletStorage'
import { isSignTransferTxCommand, isGetWalletListCommand } from './HostCommands'

enum AppMode
{
	MAIN_PAGE,
	SCANNING,
	SIGNING_TRANSFER_TX,
	SHOWING_QR,
}
interface AppState
{
	mode: AppMode
	txToSign?: { tx: IEthTransferTxRequest, wallet: IWallet }
	responseQr?: string
	walletStorage: IWalletStorage
}
export default class App extends React.Component<{}, AppState>
{
	constructor(props: {})
	{
		super(props)
		this.state = {
			mode: AppMode.MAIN_PAGE,
			walletStorage: { eth: [
				ethWallet('767406a8a64499b3b2fc139c8cbb632e72f6d9983037f5140263400aa9c7379e', 4),
				ethWallet('b2481a5b798b858dee7f2b7f7efdb8e84a8274a4a8d4bc495d4f40a3a714aa19', 4),
				ethWallet('c7729b45fbed37458da5f3304b2846cb01f260c5b24a8bd8de471eb34dd18ecb', 4),
			] }
		}
	}

	_handleBarCodeRead = (qr: string) =>
	{
		console.log(`App._handleBarCodeRead(): ${qr}`)
		let msg = parseHostCommand(qr)
		if (!msg)
			return console.log(`qr code is in incorrect format! ${qr}`)
		
		if (isSignTransferTxCommand(msg))
		{
			let txToSign = allToObj(msg, ["tx", "wallet"])
			this.setState({ txToSign })
			this.changeMode(AppMode.SIGNING_TRANSFER_TX)
		}
		if (isGetWalletListCommand(msg))
		{
			let [supportedBlockchains] = allToArray(msg, ["supportedBlockchains"])
			
			if (!supportedBlockchains)
				supportedBlockchains = ['eth', 'eos', 'neo', 'btc']
			
			console.log(`blockchains: ${supportedBlockchains}`)
			
			let wallets = supportedBlockchains
				.map(bc => this.state.walletStorage[bc]) // get wallets for blockchains
				.filter(x => x && x.length) // filter out empty wallet lists
				.map(arr => arr!.map(x => x.wallet)) // remove private keys
				.reduce((acc, cur) => acc.concat(cur), []) // flatten into array
			
			this.setState({ responseQr: `|${msg.id || ""}|${JSON.stringify(wallets)}` })
			this.changeMode(AppMode.SHOWING_QR)
		}
	}
	changeMode = (mode: AppMode) =>
	{
		this.setState({ mode })
	}
	onQrScanPress = () =>
	{
		this.changeMode(AppMode.SCANNING)
	}
	onReturnFromCamera = () =>
	{
		this.changeMode(AppMode.MAIN_PAGE)
	}
	onTxSigned = (signedTx: string) =>
	{
		console.log(`transaction signed! ${signedTx}`)
		this.setState({ responseQr: signedTx })
		this.changeMode(AppMode.SHOWING_QR)
	}
	onTxSignCancelled = () =>
	{
		console.log(`transaction sign cancelled`)
		this.changeMode(AppMode.MAIN_PAGE)
	}
	onReturnFromQr = () =>
	{
		this.changeMode(AppMode.MAIN_PAGE)
	}
	
	render(): ReactInstance
	{
		switch (this.state.mode)
		{
			case AppMode.MAIN_PAGE:
				return (
					<View style={ styles.container }>
						<Text>Main Page</Text>
						<Button title="Scan QR code" onPress={ this.onQrScanPress }></Button>
					</View>
				)
			case AppMode.SCANNING:
				return (
					<CameraView
						onBackButton={ this.onReturnFromCamera }
						onBarCodeScanned={ this._handleBarCodeRead }
					></CameraView>
				)
			case AppMode.SIGNING_TRANSFER_TX:
				return (
					<TxSignView
						tx={this.state.txToSign!.tx}
						wallet={this.state.txToSign!.wallet}
						wallets={this.state.walletStorage}
						onSign={this.onTxSigned}
						onCancel={this.onTxSignCancelled}
					></TxSignView>
				)
			case AppMode.SHOWING_QR:
				return (
					<View style={ styles.container }>
						<Text>Scan this QR on your computer</Text>
						<Text>{ this.state.responseQr }</Text>
						<QRCode value={this.state.responseQr} size={400}></QRCode>
						<Button title="Back" onPress={this.onReturnFromQr}></Button>
					</View>
				)
		}
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
