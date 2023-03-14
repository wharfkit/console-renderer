import {Checksum256, PermissionLevel} from '@greymass/eosio'
import {
    cancelable,
    Cancelable,
    LoginContext,
    PromptArgs,
    PromptElement,
    PromptResponse,
    UserInterface,
    UserInterfaceLoginResponse,
    UserInterfaceTranslateFunction,
    UserInterfaceWalletPlugin,
} from '@wharfkit/session'
import qrcode from 'qrcode-terminal'

import {countdown, printLink} from './utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompts = require('prompts')

export class ConsoleUserInterface implements UserInterface {
    async login(context: LoginContext): Promise<UserInterfaceLoginResponse> {
        const walletPluginIndex = await this.getWallet(context)
        const walletPlugin = context.walletPlugins[walletPluginIndex]
        const chainId = await this.getChain(context, walletPlugin)
        const permissionLevel = await this.getPermissionLevel(context, walletPlugin)

        return {walletPluginIndex, chainId, permissionLevel}
    }

    async onTransactComplete(): Promise<void> {
        return Promise.resolve()
    }

    async onLoginComplete(): Promise<void> {
        return Promise.resolve()
    }

    async onSignComplete(): Promise<void> {
        return Promise.resolve()
    }

    async onBroadcastComplete(): Promise<void> {
        return Promise.resolve()
    }

    async onSign(): Promise<void> {
        return Promise.resolve()
    }

    async onBroadcast(): Promise<void> {
        return Promise.resolve()
    }

    translate(): string {
        return ''
    }

    getTranslate(): UserInterfaceTranslateFunction {
        return () => {
            return ''
        }
    }

    addTranslations(): void {
        return
    }

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

    prompt(args: PromptArgs): Cancelable<PromptResponse> {
        /**
         * Prompt the user with a yes/no question.
         *
         * The message to display to the user is passed in as the first argument.
         *
         * The return value should be a boolean indicating whether the user selected yes or no.
         */

        console.log(`\n${args.title}`)

        console.log(`\n${args.body}`)

        const onEndCallbacks: (() => void)[] = []

        args.elements.forEach((element: PromptElement) => {
            if (element.label) {
                console.log(`\n${element.label}`)
            }

            if (element.type === 'qr') {
                console.log('\n')
                qrcode.generate(element.data, {small: true})
            } else if (element.type === 'countdown') {
                const onEndCallback = countdown(element?.data as string)
                onEndCallbacks.push(onEndCallback)
            } else if (element.type === 'link') {
                console.log(
                    '\nIf unable to click the link, please copy and paste the link into your browser:'
                )
                printLink(`\n${(element.data as any)?.href}`)
            }
        })

        return cancelable(
            new Promise(() => {
                // Promise that never resolves
            }),
            () => {
                // Cancel callback
                onEndCallbacks.forEach((callback) => callback())
            }
        )
    }

    async onError(error: Error): Promise<void> {
        /**
         * An error has occurred in the session.
         *
         * This is a good place to display an error message to the user.
         */

        console.error(`\n${error}`)
    }

    private async getPermissionLevel(
        context: LoginContext,
        walletPlugin: UserInterfaceWalletPlugin
    ): Promise<PermissionLevel | undefined> {
        if (
            !context.uiRequirements.requiresPermissionSelect ||
            !walletPlugin.config.requiresPermissionSelect
        ) {
            return
        }

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

    private async getChain(
        context: LoginContext,
        walletPlugin: UserInterfaceWalletPlugin
    ): Promise<Checksum256 | undefined> {
        if (
            !context.uiRequirements.requiresChainSelect ||
            !walletPlugin.config.requiresChainSelect
        ) {
            return
        }

        const {chain} = await prompts([
            {
                type: 'select',
                name: 'chain',
                message: 'Please enter the chain name',
                choices: context.chains
                    .filter((chain) => {
                        !walletPlugin.config.supportedChains ||
                            walletPlugin.config.supportedChains.includes(chain.id)
                    })
                    .map((chain) => ({
                        title: chain.name,
                        value: chain.id,
                    })),
            },
        ])

        return Checksum256.from(chain)
    }

    private async getWallet(context: LoginContext): Promise<number> {
        if (!context.uiRequirements.requiresWalletSelect) {
            return 0
        }

        const {wallet} = await prompts([
            {
                type: 'select',
                name: 'wallet',
                message: 'Please enter the chain name',
                choices: context.walletPlugins.map((wallet) => ({
                    title: wallet.metadata.name,
                })),
            },
        ])

        return wallet
    }
}
