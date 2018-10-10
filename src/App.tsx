import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { Camera, BarCodeScanner, Permissions } from "expo"

export default class App extends React.Component
{
	state = {
		lastScanned: 0,
		scanned: { },
		scanning: false,
		cameraPermissionStatus: ""
	}
	_handleBarCodeRead = ({data, type}: { data: string, type: string }) =>
	{
		let lastScanned = new Date().getTime()
		console.log(lastScanned - this.state.lastScanned, data)
		this.setState({ ...this.state, lastScanned, scanned: { ...this.state.scanned, [data]: 1 }})
		if (Object.keys(this.state.scanned).length >= 4)
		  console.log(this.state.scanned), this.setState(Object.assign({}, this.state, { scanning: false }))
	}
	askCameraPermission = async () =>
	{
		console.log('askCameraPermission()')
		const { status } = await Permissions.askAsync(Permissions.CAMERA)
		console.log(status)
		this.setState({ cameraPermissionStatus: status })
	}
	render() {
		if (!this.state.cameraPermissionStatus)
		{
			return (
			<View style={styles.container}>
				<Text>Camera permission is unknown</Text>
				<Button title="Ask camera permission" onPress={this.askCameraPermission}></Button>
			</View>)
		}
		else if (this.state.cameraPermissionStatus !== 'granted')
		{
			return <View style={styles.container}><Text>Camera status: { this.state.cameraPermissionStatus }</Text></View>
		}
		return (
			<View style={styles.container}>
				<Text>Open up App.js to start working on your app!</Text>
				<BarCodeScanner onBarCodeScanned={this._handleBarCodeRead}
						style={ StyleSheet.absoluteFill }
						barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}></BarCodeScanner>
				<Text>Scan a QR code with this!</Text>
				<Text>{JSON.stringify(this.state.scanned)}</Text>
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
