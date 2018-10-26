import { arrayToObj, objToArray, parseHostCommand, allToObj, allToArray } from "./HostProtocol"
import { IBlockchainIdent } from "./interfaces"

describe('host protocol tests', () =>
{
	it('should parse normal commands', () =>
	{
		expect(parseHostCommand('test|5|[1,2,3]'))
			.toEqual({ method: "test", id: "5", params: [1,2,3] })
		expect(parseHostCommand('test2||["hi"]'))
			.toEqual({ method: "test2", id: '', params: ["hi"] })
		expect(parseHostCommand('|5|[1,{"hi":"hello"},3]'))
			.toEqual({ method: "", id: "5", params: [1,{hi: "hello"},3] })
		expect(parseHostCommand('||[]'))
			.toEqual({ method: "", id: "", params: [] })
		expect(parseHostCommand('test2||["h|i"]'))
			.toEqual({ method: "test2", id: '', params: ["h|i"] })

		expect(parseHostCommand('test|5|{"foo":"bar","test":"test"}'))
			.toEqual({ method: "test", id: "5", params: {foo:"bar",test:"test"} })
		expect(parseHostCommand('test2||{"foo":"ba|r"}'))
			.toEqual({ method: "test2", id: '', params: {foo:"ba|r"} })
		expect(parseHostCommand('|5|{"hi":"hello"}'))
			.toEqual({ method: "", id: "5", params: {hi: "hello"} })
		expect(parseHostCommand('||{}'))
			.toEqual({ method: "", id: "", params: {} })
	})
	
	it('should convert arrays to objects', () =>
	{
		let obj: {foo: number, bar: number, baz: number, test: string} = arrayToObj([1, 2, 3, 'test'], ['foo', 'bar', 'baz', 'test'])
		expect(obj).toEqual({ foo: 1, bar: 2, baz: 3, test: 'test' })
	})
	it('should convert objects to arrays', () =>
	{
		let arr = objToArray({ foo: 1, bar: 2, baz: 3, test: "test" }, ["test", "foo", "bar", "baz"])
		expect(arr).toEqual(["test", 1, 2, 3])
	})
	it('should convert anything to objects', () =>
	{
		let obj = allToObj({ params: [1, 2, 3, 'test'] } as any, ['foo', 'bar', 'baz', 'test'])
		expect(obj).toEqual({ foo: 1, bar: 2, baz: 3, test: 'test' })
		obj = allToObj({ params: obj } as any, ['foo', 'bar', 'baz', 'test'])
		expect(obj).toEqual({ foo: 1, bar: 2, baz: 3, test: 'test' })
	})
	it('should convert anything to arrays', () =>
	{
		let arr = allToArray({ params: { foo: 1, bar: 2, baz: 3, test: "test" } } as any, ["test", "foo", "bar", "baz"])
		expect(arr).toEqual(["test", 1, 2, 3])
		arr = allToArray({ params: arr } as any, ['foo', 'bar', 'baz', 'test'])
		expect(arr).toEqual(["test", 1, 2, 3])
	})
	it('regression', () =>
	{
		let msg = parseHostCommand('getWalletList||[[]]')!
		expect(msg).not.toBeNull()
		let args = allToArray<[IBlockchainIdent[]], {supportedBlockchains: IBlockchainIdent[]}>(msg as any, ["supportedBlockchains"])
		expect(args).toEqual([[]])

		msg = parseHostCommand('getWalletList||[]')!
		expect(msg).not.toBeNull()
		args = allToArray<[IBlockchainIdent[]], {supportedBlockchains: IBlockchainIdent[]}>(msg as any, ["supportedBlockchains"])
		expect(args).toEqual([])
	})
})