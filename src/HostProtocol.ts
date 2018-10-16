export interface IHostCommand<TArr extends any[], TObj extends {}>
{
	method: string
	id: string | number
	args: TArr | TObj
}
export function parseHostCommand(msg: string): IHostCommand<any[], any>
{
	let [method, id, data] = msg.split('|', 3)
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
export function parseHostCommandToArray<TArr extends TObj[keyof TObj][], TObj>(msg: string, mapping: (keyof TObj)[]): IHostCommand<TArr, never>
{
	let m = parseHostCommand(msg)
	return { ...m, args: allToArray(m.args, mapping) }
}
export function parseHostCommandToObject<TObj>(msg: string, mapping: (keyof TObj)[]): IHostCommand<never, TObj>
{
	let m = parseHostCommand(msg)
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