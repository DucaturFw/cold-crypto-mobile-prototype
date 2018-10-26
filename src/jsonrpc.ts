type Id = string | number | null
export function notify(method: string, params: {} | unknown[], reduced: boolean = false)
{
	if (reduced)
		return `${method}||${JSON.stringify(params)}`
	
	return jrpcs({
		method,
		params,
	})
}
export function error(id: Id | undefined, error: any)
{
	return jrpcs({
		id,
		error,
	})
}
export function result<T>(id: Id | undefined, result: T, reduced: boolean = false)
{
	if (reduced)
		return `|${id}|${JSON.stringify(result)}`
	
	return jrpcs({
		id,
		result,
	})
}
export function call(method: string, id: Id, params: {} | unknown[], reduced: boolean = false)
{
	if (reduced)
		return `${method}|${id}|${JSON.stringify(params)}`
	
	return jrpcs({
		method,
		id,
		params,
	})
}
export function jrpc<T extends { id?: string | number | null, method?: string }>(obj: T): T & { jsonrpc: "2.0" }
{
	return Object.assign({ }, obj, { jsonrpc: "2.0" } as { jsonrpc: "2.0" })
}
export function jrpcs<T extends { id?: string | number | null, method?: string }>(obj: T)
{
	return JSON.stringify(jrpc(obj))
}