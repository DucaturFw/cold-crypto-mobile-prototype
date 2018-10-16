import { arrayToObj, objToArray, parseHostCommand, allToObj, allToArray, parseHostCommandToArray, parseHostCommandToObject } from "./HostProtocol"
import { IBlockchainIdent } from "./interfaces"

describe('host protocol tests', () =>
{
	it('should parse normal commands', () =>
	{
		expect(parseHostCommand('test|5|[1,2,3]'))
			.toEqual({ method: "test", id: "5", args: [1,2,3] })
		expect(parseHostCommand('test2||["hi"]'))
			.toEqual({ method: "test2", id: '', args: ["hi"] })
		expect(parseHostCommand('|5|[1,{"hi":"hello"},3]'))
			.toEqual({ method: "", id: "5", args: [1,{hi: "hello"},3] })
		expect(parseHostCommand('||[]'))
			.toEqual({ method: "", id: "", args: [] })
		expect(parseHostCommand('test2||["h|i"]'))
			.toEqual({ method: "test2", id: '', args: ["h|i"] })

		expect(parseHostCommand('test|5|{"foo":"bar","test":"test"}'))
			.toEqual({ method: "test", id: "5", args: {foo:"bar",test:"test"} })
		expect(parseHostCommand('test2||{"foo":"ba|r"}'))
			.toEqual({ method: "test2", id: '', args: {foo:"ba|r"} })
		expect(parseHostCommand('|5|{"hi":"hello"}'))
			.toEqual({ method: "", id: "5", args: {hi: "hello"} })
		expect(parseHostCommand('||{}'))
			.toEqual({ method: "", id: "", args: {} })
	})
	it('should parse array commands', () =>
	{
		expect(parseHostCommandToArray('test|5|[1,2,3]', ["foo", "bar", "baz"]))
			.toEqual({ method: "test", id: "5", args: [1,2,3] })
		expect(parseHostCommandToArray('test|5|{"foo":1,"bar":2,"baz":3}', ["foo", "bar", "baz"]))
			.toEqual({ method: "test", id: "5", args: [1,2,3] })
	})
	it('should parse object commands', () =>
	{
		expect(parseHostCommandToObject('test|5|[1,2,3]', ["foo", "bar", "baz"]))
			.toEqual({ method: "test", id: "5", args: {foo:1, bar:2, baz:3} })
		expect(parseHostCommandToObject('test|5|{"foo":1,"bar":2,"baz":3}', ["foo", "bar", "baz"]))
			.toEqual({ method: "test", id: "5", args: {foo:1, bar:2, baz:3} })
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
		let obj = allToObj<{foo: number, bar: number, baz: number, test: string}>([1, 2, 3, 'test'], ['foo', 'bar', 'baz', 'test'])
		expect(obj).toEqual({ foo: 1, bar: 2, baz: 3, test: 'test' })
		obj = allToObj(obj, ['foo', 'bar', 'baz', 'test'])
		expect(obj).toEqual({ foo: 1, bar: 2, baz: 3, test: 'test' })
	})
	it('should convert anything to arrays', () =>
	{
		let arr = allToArray({ foo: 1, bar: 2, baz: 3, test: "test" }, ["test", "foo", "bar", "baz"])
		expect(arr).toEqual(["test", 1, 2, 3])
		arr = allToArray(arr, ['foo', 'bar', 'baz', 'test'])
		expect(arr).toEqual(["test", 1, 2, 3])
	})
	it('regression', () =>
	{
		let msg = parseHostCommand('getWalletList||[[]]')!
		expect(msg).not.toBeNull()
		let args = allToArray<[IBlockchainIdent[]], {supportedBlockchains: IBlockchainIdent[]}>(msg.args, ["supportedBlockchains"])
		expect(args).toEqual([[]])

		msg = parseHostCommand('getWalletList||[]')!
		expect(msg).not.toBeNull()
		args = allToArray<[IBlockchainIdent[]], {supportedBlockchains: IBlockchainIdent[]}>(msg.args, ["supportedBlockchains"])
		expect(args).toEqual([])
	})
})