import { IHostCommand, IHCSimple } from "./HostProtocol"
import { IBlockchainIdent, IWallet, IEthTransferTxRequest } from "./interfaces"

export function isGetWalletListCommand(msg: IHostCommand<unknown[], unknown>):
	msg is IHCSimple<{supportedBlockchains: IBlockchainIdent[]}>
{
	return msg.method == "getWalletList"
}
export function isSignTransferTxCommand(msg: IHostCommand<unknown[], unknown>):
	msg is IHCSimple<{tx: IEthTransferTxRequest}, {wallet: IWallet}>
{
	return msg.method == "signTransferTx"
}