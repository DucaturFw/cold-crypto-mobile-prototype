declare module "@warren-bank/ethereumjs-tx-unsign"
{
	import { Buffer } from "buffer"

	function unsign(rawTx: string | Buffer, to_hex?: boolean, add_prefix_txData?: boolean, add_prefix_signature?: boolean): {
		txData: {
			nonce: string | Buffer,
			gasPrice: string | Buffer,
			gasLimit: string | Buffer,
			to: string | Buffer,
			value: string | Buffer,
			data: string | Buffer,
			chainId: number
		},
		signature: { v: string, r: string, s: string }
	}

	export = unsign
}