export type ISignature = string | object
export type IAddress = string
export type IHexString = string

export interface IPublicAccount
{
	address: IAddress
	publicKey?: IHexString
}
export interface IFullAccount extends IPublicAccount
{
	privateKey: IHexString
}
export interface IEncryption
{
	encrypt(data: IHexString, password: string): IHexString
	decrypt(data: IHexString, password: string): IHexString
}

export type HashFunction = (data: string) => IHexString

export interface IBlockchain<ITransaction, IAddressOptions>
{
	// derive address (and public key if applicable) from private key
	privateKeyToAccount(privateKey: IHexString, opts?: IAddressOptions): IFullAccount
	
	// sign transaction with the provided key
	// returns signed tx in hex
	signTx(tx: ITransaction, privateKey: IHexString): IHexString
	
	// sign message with the provided key
	// returns signature in blockchain-specific format
	// sign(msg: IHexString, privateKey: IHexString): ISignature
	
	// check if this message was signed with the provided address
	// checkSig(msg: IHexString, account: IPublicAccount, signature: ISignature): boolean
	
	// get account that has signed the message
	// getSigner(msg: IHexString, signature: ISignature): IPublicAccount
	
	// hash function
	// hash: HashFunction
}