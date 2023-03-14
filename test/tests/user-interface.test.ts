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
            await consoleUserInterface.onLogin()

            expect(consoleStub.calledWith('\nInitiating login...\n')).to.be.true
        })
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

            expect(consoleStub.calledWith(`\n${message}`)).to.be.true
        })
    })

    describe('login', () => {
        it('should call the prompts library and return a PermissionLevel instance', async () => {
            const context = {
                uiRequirements: {
                    requiresWalletSelect: true,
                    requiresChainSelect: true,
                    requiresPermissionSelect: true,
                },
                walletPlugins: [
                    {
                        metadata: {
                            name: 'test-wallet',
                        },
                        config: {
                            requiresChainSelect: true,
                            requiresPermissionSelect: true,
                        },
                    },
                ],
                chains: [
                    {
                        id: mockChainId,
                    },
                ],
            }

            promptsStub.resolves({
                name: 'test-account',
                permission: 'active',
                chain: mockChainId,
                wallet: 0,
            })

            const {walletPluginIndex, chainId, permissionLevel} = await consoleUserInterface.login(
                context
            )

            expect(promptsStub.called).to.be.true

            expect(walletPluginIndex).to.equal(0)
            expect(chainId).to.be.an.instanceof(Checksum256)
            expect(chainId.equals(Checksum256.from(mockChainId))).to.be.true
            expect(permissionLevel).to.be.an.instanceOf(PermissionLevel)
            expect(permissionLevel.equals(PermissionLevel.from('test-account@active'))).to.be
        })
    })
})
