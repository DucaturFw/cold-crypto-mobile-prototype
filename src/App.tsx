import React from 'react'
import { StyleSheet, Text, View, Button, Platform } from 'react-native'
import { Camera, BarCodeScanner, Permissions, CameraObject } from "expo"

export default class App extends React.Component
{
	state = {
		lastScanned: 0,
		scanned: { },
		scanning: false,
		cameraPermissionStatus: "",
		cameraRatio: '',
		cameraPictureSize: '',
	}
	camera?: CameraObject

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
	onScanPress = async () =>
	{
		console.log('onScanPress()')
		if (!this.camera)
			return console.log('App.onScanPress: no camera found!')
		
		let startTime = new Date().getTime()
		console.log(startTime)
		let pic = await this.camera.takePictureAsync({ exif: false, skipProcessing: true, quality: 0, onPictureSaved: (pipic) =>
		{
			console.log(new Date().getTime())
			console.log(`&&& photo took ${(new Date().getTime() - startTime) / 1000} seconds`)
		} })
		console.log(new Date().getTime())
		console.log(`photo took ${(new Date().getTime() - startTime) / 1000} seconds`)
		// console.log(pic)
	}
	onCameraReady = async () =>
	{
		if (!this.camera)
			return console.log(`App.onCameraReady: camera is ${this.camera}!`)
		
		if (Platform.OS != 'android')
			return
		
		// load ratios
		let ratios = await this.camera.getSupportedRatiosAsync()
		
		let cameraRatio = null
		if (ratios.includes('16:9'))
			cameraRatio = '16:9'
		else if (ratios.length > 0)
			cameraRatio =  ratios[0]
		
		console.log(`set new camera ratio: ${cameraRatio}`)
		this.setState({ cameraRatio })

		// load picture sizes
		if (!cameraRatio)
			return console.log(`App.onCameraReady: can't load camera sizes`)
		
		let sizes = await this.camera.getAvailablePictureSizesAsync(cameraRatio)
		let minIndex = 0
		let size = null
		if (sizes && sizes.length)
		{
			console.log(`App.onCameraReady: got sizes ${sizes}`)
			let ints = sizes.map(x => x.split('x').map(x => parseInt(x, 10)))
			// console.log(ints)
			let squares = ints.map(([x, y]) => x * y)
			// console.log(squares)
			minIndex = squares.indexOf(Math.min.apply(null, squares))
			size = sizes[minIndex]
		}
		console.log(`App.onCameraReady: min picture size is ${size}`)

		this.setState({ cameraPictureSize: size })
	}
	initCamera = async (camera: CameraObject) =>
	{
		this.camera = camera
		
		
		let ratios = null
		/* let retries = 0
		while (!ratios && (retries < 5))
		{
			retries++;
			try
			{
				
			}
			catch(e)
			{
				console.log(`App.initCamera(): encountered error on supported ratios, retrying ${retries}/5...`)
			}
		} */
		if (!ratios)
			return
		
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
		let cameraAttrs = { ratio: this.state.cameraRatio, pictureSize: this.state.cameraPictureSize }
		if (!this.state.cameraRatio)
			delete cameraAttrs.ratio
		if (!this.state)
			delete cameraAttrs.pictureSize
		
		return (
			<View style={styles.container}>
				<Text>Open up App.js to start working on your app!</Text>
				<Camera onBarCodeScanned={this._handleBarCodeRead}
					style={ StyleSheet.absoluteFill }
					barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
					ref={ (r: any) => this.camera = r }
					onCameraReady={ this.onCameraReady }
					{ ...cameraAttrs }
				></Camera>
				<Text>Scan a QR code with this!</Text>
				<Text>{JSON.stringify(this.state.scanned)}</Text>
				<Button title="SCAN" onPress={this.onScanPress} ></Button>
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
