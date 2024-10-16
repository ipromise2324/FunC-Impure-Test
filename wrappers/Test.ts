import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type TEstConfig = {};

export function tEstConfigToCell(config: TEstConfig): Cell {
    return beginCell().endCell();
}

export class Test implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Test(address);
    }

    static createFromConfig(config: TEstConfig, code: Cell, workchain = 0) {
        const data = tEstConfigToCell(config);
        const init = { code, data };
        return new Test(contractAddress(workchain, init), init);
    }

    async sendWithoutDump(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint = 1n) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0xe3c4f498, 32).storeUint(queryId, 64).endCell(),
        });
    }

    async sendWithDump(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint = 1n) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x9d848e0e, 32).storeUint(queryId, 64).endCell(),
        });
    }

    async sendSumDirectly(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint = 1n) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0xc8bd9f4d, 32).storeUint(queryId, 64).endCell(),
        });
    }

    async sendMulDirectly(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint = 1n) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0xa90221a1, 32).storeUint(queryId, 64).endCell(),
        });
    }
}
