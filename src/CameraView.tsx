import React from 'react'
import { StyleSheet, Text, View, Button, Platform } from 'react-native'
import { Camera, BarCodeScanner, Permissions, CameraObject } from "expo"

export interface CameraViewProps
{
	onBarCodeScanned?: (qr: string) => void
	onPacketComplete?: (packets: string[]) => void
	onBackButton?: () => void
}
export interface CameraViewState
{
	cameraPermissionStatus?: string
	cameraRatio?: string
	cameraPictureSize?: string
}

export default class CameraView extends React.Component<CameraViewProps, CameraViewState>
{
	state = {
		cameraPermissionStatus: '',
		cameraRatio: '',
		cameraPictureSize: '',
	}
	camera?: CameraObject

	_handleBarCodeRead = ({data, type}: { data: string, type: string }) =>
	{
		if (this.props.onBarCodeScanned)
			this.props.onBarCodeScanned(data)
	}
	componentDidMount = async () =>
	{
		let perm = await Permissions.getAsync(Permissions.CAMERA)
		let cameraPermissionStatus = perm.status
		console.log(cameraPermissionStatus)
		this.setState({ cameraPermissionStatus })
	}
	askCameraPermission = async () =>
	{
		console.log('askCameraPermission()')
		const { status } = await Permissions.askAsync(Permissions.CAMERA)
		console.log(status)
		this.setState({ cameraPermissionStatus: status })
	}
	onBackPress = () =>
	{
		if (this.props.onBackButton)
			this.props.onBackButton()
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
		
		let cameraRatio = undefined
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
		let size = undefined
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
	}
	render()
	{
		console.log(`camera permission: ${this.state.cameraPermissionStatus}`)
		if (!this.state.cameraPermissionStatus)
		{
			return (
				<View style={styles.container}>
					<Text>Camera permission is unknown</Text>
					<Button title="Ask camera permission" onPress={this.askCameraPermission}></Button>
				</View>
			)
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
				<Text>Scan a QR code with this!</Text>
				<Camera onBarCodeScanned={this._handleBarCodeRead}
					style={ StyleSheet.absoluteFill }
					barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
					ref={ (r: any) => this.camera = r }
					onCameraReady={ this.onCameraReady }
					{ ...cameraAttrs }
				></Camera>
				<Button title="SCAN" onPress={this.onScanPress} ></Button>
				<Button title="BACK" onPress={this.onBackPress} ></Button>
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
