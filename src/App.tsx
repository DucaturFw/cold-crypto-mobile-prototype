import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import CameraView from './CameraView'

export default class App extends React.Component
{
	state = {
		lastScanned: 0,
		scanned: { },
		scanning: false,
	}

	_handleBarCodeRead = (qr: string) =>
	{
		let lastScanned = new Date().getTime()
		console.log(lastScanned - this.state.lastScanned, qr)
		this.setState({ ...this.state, lastScanned, scanned: { ...this.state.scanned, [qr]: 1 }, scanning: false})
		if (Object.keys(this.state.scanned).length >= 4)
		  console.log(this.state.scanned), this.setState(Object.assign({}, this.state, { scanning: false }))
	}
	onQrScanPress = () =>
	{
		this.setState({ scanning: true })
	}
	onReturnFromCamera = () =>
	{
		this.setState({ scanning: false })
	}
	
	render()
	{
		if (this.state.scanning)
		{
			return (
				<CameraView
					onBackButton={ this.onReturnFromCamera }
					onBarCodeScanned={ this._handleBarCodeRead }
				></CameraView>
			)
		}
		return (
			<View style={ styles.container }>
				<Text>Main Page</Text>
				<Button title="Scan QR code" onPress={ this.onQrScanPress }></Button>
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
