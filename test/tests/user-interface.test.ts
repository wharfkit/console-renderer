import * as sinon from 'sinon'
import {PermissionLevel, Checksum256} from '@greymass/eosio'

import {mockChainId, secondMockChainId} from '../utils/mock-config'

let promptsStub = sinon.stub()

// First we need to remove the doStuff module
delete require.cache[require.resolve('prompts')]
// Second we need rewrite the cached sum module to be as follows:
require.cache[require.resolve('prompts')] = {
    exports: promptsStub,
} as any

import {expect} from 'chai'
import {ConsoleUserInterface} from '../../src/user-interface'

describe('ConsoleUserInterface', () => {
    let consoleStub
    let consoleUserInterface

    beforeEach(() => {
        consoleStub = sinon.stub(console, 'log')

        consoleUserInterface = new ConsoleUserInterface()
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('onLogin', () => {
        it('should log that a login is initiated', async () => {
            consoleUserInterface.onLogin()

            expect(consoleStub.calledWith('Initiating login...')).to.be.true
        })

        describe('onLoginResult', () => {
            it('should not raise an error', async () => {
                try {
                    await consoleUserInterface.onLoginResult()
                } catch (error) {
                    expect.fail(`An error was raised: ${error}`)
                }
            })
        })

        describe('onTransact', () => {
            it('should log that a transaction is initiated', async () => {
                consoleUserInterface.onTransact()

                expect(consoleStub.calledWith('Initiating transaction...')).to.be.true
            })
        })

        describe('onTransactResult', () => {
            it('should not raise an error', async () => {
                try {
                    await consoleUserInterface.onTransactResult()
                } catch (error) {
                    expect.fail(`An error was raised: ${error}`)
                }
            })
        })

        describe('status', () => {
            it('should call console.log with the message', () => {
                const message = 'test message'

                consoleUserInterface.status(message)

                expect(consoleStub.calledWith(message)).to.be.true
            })
        })
    })

    describe('onSelectPermissionLevel', () => {
        it('should call the prompts library and return a PermissionLevel instance', async () => {
            const context = {}
            promptsStub.resolves({name: 'test-account', permission: 'active'})

            const permissionLevel = await consoleUserInterface.onSelectPermissionLevel(context)

            expect(promptsStub.called).to.be.true
            expect(permissionLevel).to.be.an.instanceOf(PermissionLevel)
        })
    })

    describe('onSelectChain', () => {
        it('should call the prompts library and return a Checksum256 instance', async () => {
            const context = {
                chains: [
                    {id: mockChainId, name: 'test-chain'},
                    {id: secondMockChainId, name: 'jungle-testnet'},
                ],
            }
            promptsStub.resolves({chain: mockChainId})

            const chainId = await consoleUserInterface.onSelectChain(context)

            expect(promptsStub.called).to.be.true
            expect(chainId).to.be.an.instanceof(Checksum256)
            expect(chainId.equals(Checksum256.from(mockChainId))).to.be.true
        })
    })

    describe('onSelectWallet', () => {
        it('should call the prompts library and return the index of the selected wallet', async () => {
            const context = {walletPlugins: [{name: 'wallet-1'}, {name: 'wallet-2'}]}
            promptsStub.resolves({wallet: 1})

            const selectedWalletIndex = await consoleUserInterface.onSelectWallet(context)

            expect(promptsStub.called).to.be.true
            expect(selectedWalletIndex).to.equal(1)
        })
    })
})
