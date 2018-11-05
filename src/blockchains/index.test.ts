import { eth } from "./"
import { IBlockchain } from "./interfaces"
import { ITransaction as EthTx } from "./eth"

let ethB: IBlockchain<EthTx, {}> = eth