import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Test } from '../wrappers/Test';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Impure Test', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Test');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let test: SandboxContract<Test>;
    describe('When executing op::without_dump, the result returned by sum() is not used. Even though I marked sum() as impure, the contract still does not throw an error.', () => {
        it('contract did not throw error if code without ~dump()', async () => {
            blockchain = await Blockchain.create();

            test = blockchain.openContract(Test.createFromConfig({}, code));

            deployer = await blockchain.treasury('deployer');
            const sumResult = await test.sendWithoutDump(deployer.getSender(), toNano('0.05'));
            printTransactionFees(sumResult.transactions);

            expect(sumResult.transactions[1]).toHaveTransaction({
                from: deployer.address,
                to: test.address,
                success: true,
            });
        });
    });
    describe('When executing op::with_dump, the result returned by mul() is used -> Contract throws error', () => {
        it('contract throw error if code use ~dump()', async () => {
            blockchain = await Blockchain.create();

            test = blockchain.openContract(Test.createFromConfig({}, code));

            deployer = await blockchain.treasury('deployer');
            const mulResult = await test.sendWithDump(deployer.getSender(), toNano('0.05'));
            printTransactionFees(mulResult.transactions);

            expect(mulResult.transactions[1]).toHaveTransaction({
                from: deployer.address,
                to: test.address,
                success: false,
                exitCode: 1001,
            });
        });
    });

    describe('Call sum() directly and it did throw error even contract did not use the return value', () => {
        it('contract throw error when contract call sum() directly and did not ues the return value', async () => {
            blockchain = await Blockchain.create();

            test = blockchain.openContract(Test.createFromConfig({}, code));

            deployer = await blockchain.treasury('deployer');
            const sumResult = await test.sendSumDirectly(deployer.getSender(), toNano('0.05'));
            printTransactionFees(sumResult.transactions);

            expect(sumResult.transactions[1]).toHaveTransaction({
                from: deployer.address,
                to: test.address,
                success: false,
                exitCode: 1000,
            });
        });
    });

    describe('Call mul() directly and it did throw error when contract use the return value', () => {
        it('contract throw error when contract call mul() directly and contract ues the return value', async () => {
            blockchain = await Blockchain.create();

            test = blockchain.openContract(Test.createFromConfig({}, code));

            deployer = await blockchain.treasury('deployer');
            const mulResult = await test.sendMulDirectly(deployer.getSender(), toNano('0.05'));
            printTransactionFees(mulResult.transactions);

            expect(mulResult.transactions[1]).toHaveTransaction({
                from: deployer.address,
                to: test.address,
                success: false,
                exitCode: 1001,
            });
        });
    });
});
