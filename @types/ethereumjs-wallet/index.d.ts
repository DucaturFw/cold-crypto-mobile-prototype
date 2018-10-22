declare module 'ethereumjs-wallet'
{
	import { Buffer } from 'buffer'

	interface IWalletV3Options
	{
		salt?: Buffer
		iv?: Buffer
		kdf?: string
		dklen?: number
		c?: number
		n?: number
		r?: number
		p?: number
		cipher?: string
		uuid?: Buffer
	}
	interface IWalletV3
	{
		version: 3
		id: string
		address: string
		crypto: {
			ciphertext: string
			cipherparams: {
				iv: string
			}
			cipher: string
			kdf: string
			kdfparams: {
				dklen: number
				salt: Buffer
			} & ({
				c: number
				prf: string
			} | {
				n: number
				r: number
				p: number
			})
			mac: string
		}
	}
	interface IWalletV1
	{
		Version: '1'
		Crypto: {
			KeyHeader: {
				Kdf: 'scrypt'
				KdfParams: {
					N: number
					R: number
					P: number
					DkLen: number
				}
			}
			Salt: string
			CypherText: string
			MAC: string
			IV: string
		}
	}
	interface IEthSale
	{
		encseed: string
		ethaddr: string
	}
	class Wallet
	{
		static generate(icapDirect?: boolean): Wallet
		static generateVanityAddress(pattern: string | RegExp): Wallet
		static fromPublicKey(pub: Buffer, nonStrict?: boolean): Wallet
		static fromExtendedPublicKey(pub: string): Wallet
		static fromPrivateKey(priv: Buffer): Wallet
		static fromExtendedPrivateKey(priv: string): Wallet
		static fromV1(input: string | IWalletV1, password: string): Wallet
		static fromV3(input: string | IWalletV3, password: string, nonStrict?: boolean): Wallet
		static fromEthSale(input: string | IEthSale, password: string): Wallet
		
		constructor(priv: Buffer)
		constructor(priv: never, pub: Buffer)
		privKey: Buffer
		pubKey: Buffer
		getPrivateKey(): Buffer
		getPrivateKeyString(): string
		getPublicKey(): Buffer
		getPublicKeyString(): string
		getAddress(): Buffer
		getAddressString(): string
		getChecksumAddressString(): string
		toV3(password: string, opts?: IWalletV3Options): IWalletV3
		toV3String(password: string, opts?: IWalletV3Options): string
		getV3Filename(timestamp?: number): string
	}
	export = Wallet
}