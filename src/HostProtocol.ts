export interface IHostCommand<TArr extends (TObj[keyof TObj][] | unknown[]), TObj>
{
	method: string
	id: string | number
	args: TArr | TObj
}

export type IHCSimple<T1 = unknown, T2 = unknown, T3 = unknown, T4 = unknown, T5 = unknown, T6 = unknown, T7 = unknown>
	= IHostCommand<
		[T1[keyof T1], T2[keyof T2], T3[keyof T3], T4[keyof T4], T5[keyof T5], T6[keyof T6], T7[keyof T7]],
		T1 & T2 & T3 & T4 & T5 & T6 & T7
	>

export function parseHostCommand(msg: string): IHostCommand<unknown[], unknown> | undefined
{
	if (!msg)
		return undefined // empty message
	
	if (!/^.*\|.*\|.*$/.test(msg))
		return undefined // not enough data to parse

	let [method, id, data] = msg.split('|', 3).map(x => x || "")
	
	let prefixLength = method.length + id.length + data.length + 2
	if (msg.length > prefixLength)
		data += msg.substr(prefixLength)
	
	let args = JSON.parse(data || "[]")
	return {
		method,
		id,
		args
	}
}
export function arrayToObj<TArr extends any[], TObj>(args: TArr, mapping: (keyof TObj)[]): TObj
{
	return args.reduce((acc, cur, idx) => (acc[mapping[idx]] = cur, acc), {})
}
export function objToArray<TArr extends TObj[keyof TObj][], TObj extends {}>(args: TObj, mapping: (keyof TObj)[]): TArr
{
	return mapping.map(name => args[name]) as TArr
}
export function allToObj<TObj>(msg: IHostCommand<TObj[keyof TObj][], TObj>, mapping: (keyof TObj)[]): TObj
{
	return Array.isArray(msg.args) ? arrayToObj(msg.args, mapping) : msg.args
}
export function allToArray<TArr extends TObj[keyof TObj][], TObj>(msg: IHostCommand<TArr, TObj>, mapping: (keyof TObj)[]): TArr
{
	return Array.isArray(msg.args) ? msg.args : objToArray(msg.args, mapping)
}