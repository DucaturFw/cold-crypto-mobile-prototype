import { IWalletStorage, IWallet, IWalletWithPk } from "./interfaces"
import { eth } from "bcts/src/blockchains"

export function getPk(storage: IWalletStorage, wallet: IWallet): string | null
{
	let bc = storage[wallet.blockchain]
	if (!bc)
		return null
	let w = bc.find(x => compareFields(x.wallet, wallet, "blockchain", "address", "chainId"))
	if (!w)
		return null
	
	return w.pk
}

export function ethWallet(pk: string, chainId: number): IWalletWithPk
{
	let address = eth.privateKeyToAccount(pk).address
	return {
		pk,
		wallet: {
			address,
			blockchain: 'eth',
			chainId
		}
	}
}

export function compareFields<T>(obj1: T, obj2: T, ...fields: (keyof T)[]): boolean
{
	if ((obj1 == null) != (obj2 == null))
		return false
	
	if ((obj1 == null) && (obj2 == null))
		return true
	
	for (let idx = 0; idx < fields.length; idx++)
	{
		const field = fields[idx]
		if (obj1[field] != obj2[field])
			return false
	}
	return true
}