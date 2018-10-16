import React, { ReactInstance } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import CameraView from './CameraView'
import TxSignView from './TxSignView'
import { parseHostCommand, allToObj, allToArray } from './HostProtocol'
import { IWallet, IEthTransferTxRequest, IBlockchainIdent } from './interfaces'
import QRCode from 'react-native-qrcode';

enum AppMode
{
	MAIN_PAGE,
	SCANNING,
	SIGNING_TRANSFER_TX,
	SHOWING_QR,
}
interface ITxToSign
{
	wallet: IWallet
	tx: IEthTransferTxRequest
}
interface AppState
{
	mode: AppMode
	txToSign?: ITxToSign
	responseQr?: string
}
export default class App extends React.Component<{}, AppState>
{
	constructor(props: {})
	{
		super(props)
		this.state = { mode: AppMode.MAIN_PAGE }
	}

	_handleBarCodeRead = (qr: string) =>
	{
		console.log(`App._handleBarCodeRead(): ${qr}`)
		let msg = parseHostCommand(qr)
		if (!msg)
			return console.log(`qr code is in incorrect format! ${qr}`)
		
		if (msg.method == "signTransferTx")
		{
			let args = allToObj<ITxToSign>(msg.args, ["tx", "wallet"])
			this.setState({ txToSign: args })
			this.changeMode(AppMode.SIGNING_TRANSFER_TX)
		}
		if (msg.method == "getWalletList")
		{
			let [supportedBlockchains] = allToArray<[IBlockchainIdent[]], {supportedBlockchains: IBlockchainIdent[]}>(msg.args, ["supportedBlockchains"])
			let wallets = [] as IWallet[]
			console.log(`blockchains: ${supportedBlockchains}`)
			if (supportedBlockchains && supportedBlockchains.includes("eth"))
				wallets.push({ blockchain: "eth", chainId: 1, address: "0x0000000000000000000000000000000000000000" })
			
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
