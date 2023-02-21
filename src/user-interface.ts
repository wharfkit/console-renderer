import {Checksum256, PermissionLevel} from '@greymass/eosio'
import {LoginContext, PromptArgs, PromptElement, UserInterface} from '@wharfkit/session'
import qrcode from 'qrcode-terminal'

import {countdown, printLink} from './utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompts = require('prompts')

export class ConsoleUserInterface implements UserInterface {
    /**
     * onLogin
     *
     * @param options LoginOptions
     */
    async onLogin(): Promise<void> {
        /**
         * A login call has been initiated.
         *
         * Prepare any UI elements required for the login process.
         */
        console.log('\nInitiating login...\n')
    }

    /**
     * onLoginResult
     */
    async onLoginResult(): Promise<void> {
        /**
         * The login call has completed.
         *
         * Cleanup any UI elements or state from the login process.
         */
    }

    /**
     * onTransact
     *
     * @param context TransactContext
     */
    async onTransact(): Promise<void> {
        /**
         * A transact call has been initiated.
         *
         * Prepare any UI elements required for the transact process.
         */
    }

    /**
     * onTransactResult
     */
    async onTransactResult(): Promise<void> {
        /**
         * The transact call has completed.
         *
         * Cleanup any UI elements or state from the transact process.
         */
    }

    /**
     * status
     *
     * @param message string
     */
    status(message: string) {
        /**
         * Plugins (TransactPlugins, WalletPlugins, etc) can use this to push generic text-only messages to the user interface.
         *
         * The UserInterface can decide how to surface this information to the user.
         */

        console.log(`\n${message}`)
    }

    /**
     * onSelectPermissionLevel
     *
     * @param context LoginContext
     * @returns Promise<PermissionLevel>
     */
    async onSelectPermissionLevel(context: LoginContext): Promise<PermissionLevel> {
        /**
         * Present the user with an interface to select a permission level to use for the session.
         *
         * A basic example of how this could be done is two text inputs, one for the account name ('teamgreymass')
         * and one for the permission ('active').
         *
         * The PermissionLevel object for this data should be returned below.
         *
         * NOTE: This isn't often used, but will be needed for user interfaces that interact directly with hardware
         * wallets like Ledger. When using a Ledger directly, the user interface should be able to retrieve the public
         * key from the device here, and then do account lookups to display choices.
         *
         * Most wallets (Anchor, Scatter, Wombat, PrivateKeyPlugin, etc) won't use this step since they will return
         * the permission level directly from the wallet.
         */

        const {name, permission} = await (prompts as any)([
            {
                type: 'text',
                name: 'name',
                message: 'Please enter the account name',
            },
            {
                type: 'text',
                name: 'permission',
                message: 'Please enter the permission',
                default: 'active',
            },
        ])

        return PermissionLevel.from(`${name}@${permission}`)
    }

    /**
     * onSelectChain
     *
     * @param context LoginContext
     * @returns Promise<Checksum256>
     */
    async onSelectChain(context: LoginContext): Promise<Checksum256> {
        /**
         * Present the user with an interface to select one of the blockchains from the config.
         *
         * An array of available chains can be found in the `context.chains` array.
         *
         * The chainId (a Checksum256 value) of the selected chain should be returned.
         */

        const {chain} = await prompts([
            {
                type: 'select',
                name: 'chain',
                message: 'Please enter the chain name',
                choices: context.chains.map((chain) => ({
                    title: chain.name,
                    value: chain.id,
                })),
            },
        ])

        return Checksum256.from(chain)
    }

    /**
     * onSelectWallet
     *
     * @param context LoginContext
     * @returns Promise<number>
     */
    async onSelectWallet(context: LoginContext): Promise<number> {
        /**
         * Present the user with an interface to select one of the walletPlugins from the config.
         *
         * An array of the metadata about WalletPlugins is available in `context.walletPlugins`
         * which can be used to display options.
         *
         * The index in the array of the wallet selected by the user should be returned below.
         */

        const {wallet} = await prompts([
            {
                type: 'select',
                name: 'wallet',
                message: 'Please enter the chain name',
                choices: context.walletPlugins.map((wallet) => ({
                    title: wallet.name,
                })),
            },
        ])

        return wallet
    }

    async onError(error: Error): Promise<void> {
        /**
         * An error has occurred in the session.
         *
         * This is a good place to display an error message to the user.
         */

        console.error(`\n${error}`)
    }

    prompt(args: PromptArgs): void {
        /**
         * Prompt the user with a yes/no question.
         *
         * The message to display to the user is passed in as the first argument.
         *
         * The return value should be a boolean indicating whether the user selected yes or no.
         */

        console.log(`\n${args.title}`)

        console.log(`\n${args.body}`)

        args.elements.forEach((element: PromptElement) => {
            if (element.label) {
                console.log(`\n${element.label}`)
            }

            if (element.type === 'qr') {
                console.log('\n')
                qrcode.generate(element.data, {small: true})
            } else if (element.type === 'countdown') {
                console.log({element: element?.data})
                countdown(element?.data as string)
            } else if (element.type === 'button') {
                console.log(
                    '\nIf unable to click the link, please copy and paste the link into your browser:'
                )
                printLink(`\n${element.data}`)
            }
        })
    }
}
