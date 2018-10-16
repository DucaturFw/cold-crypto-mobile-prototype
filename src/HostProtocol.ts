export interface IHostCommand<TArr extends any[], TObj extends {}>
{
	method: string
	id: string | number
	args: TArr | TObj
}
export function parseHostCommand(msg: string): IHostCommand<any[], any> | undefined
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
export function parseHostCommandToArray<TArr extends TObj[keyof TObj][], TObj>(msg: string, mapping: (keyof TObj)[]): IHostCommand<TArr, never> | undefined
{
	let m = parseHostCommand(msg)
	if (!m)
		return undefined
	return { ...m, args: allToArray(m.args, mapping) }
}
export function parseHostCommandToObject<TObj>(msg: string, mapping: (keyof TObj)[]): IHostCommand<never, TObj> | undefined
{
	let m = parseHostCommand(msg)
	if (!m)
		return undefined
	return { ...m, args: allToObj(m.args, mapping) }
}
export function arrayToObj<TArr extends any[], TObj>(args: TArr, mapping: (keyof TObj)[]): TObj
{
	return args.reduce((acc, cur, idx) => (acc[mapping[idx]] = cur, acc), {})
}
export function objToArray<TArr extends TObj[keyof TObj][], TObj extends {}>(args: TObj, mapping: (keyof TObj)[]): TArr
{
	return mapping.map(name => args[name]) as TArr
}
export function allToObj<TObj>(args: TObj | TObj[keyof TObj][], mapping: (keyof TObj)[]): TObj
{
	return Array.isArray(args) ? arrayToObj(args, mapping) : args
}
export function allToArray<TArr extends TObj[keyof TObj][], TObj>(args: TObj | TArr, mapping: (keyof TObj)[]): TArr
{
	return Array.isArray(args) ? args : objToArray(args, mapping)
}