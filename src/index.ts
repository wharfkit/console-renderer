import {Checksum256, PermissionLevel} from '@greymass/eosio'
import {UserInterface, LoginOptions, TransactContext, LoginContext} from '@wharfkit/session'

export class UserInterfaceTEMPLATE implements UserInterface {
    /**
     * onLogin
     *
     * @param options LoginOptions
     */
    async onLogin(options?: LoginOptions): Promise<void> {
        /**
         * A login call has been initiated.
         *
         * Prepare any UI elements required for the login process.
         */
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
    async onTransact(context: TransactContext): Promise<void> {
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
        return PermissionLevel.from('teamgreymass@active')
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
        return Checksum256.from('0000000000000000000000000000000000000000000000000000000000000000')
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
        return 0
    }
}
