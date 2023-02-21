import {SessionKit} from '@wharfkit/session'
import {WalletPluginAnchor} from '@wharfkit/wallet-plugin-anchor'

import {mockChainId, mockUrl} from '../utils/mock-config'
import {makeMockAction} from '../utils/mock-actions'

const {ConsoleUserInterface} = require('../../../lib/console-renderer')

let walletData = {}

const sessionKit = new SessionKit({
    appName: 'wharf console app',
    chains: [
        {
            id: mockChainId,
            url: mockUrl,
        },
    ],
    walletPlugins: [new WalletPluginAnchor()],
    ui: new ConsoleUserInterface(),
    storage: {
        write(key: string, data: string): Promise<void> {
            walletData[key] = data

            return Promise.resolve()
        },
        read(key: string): Promise<string | null> {
            if (walletData[key]) {
                return Promise.resolve(walletData[key])
            } else {
                return Promise.resolve(null)
            }
        },
        remove(key: string): Promise<void> {
            delete walletData[key]

            return Promise.resolve()
        },
    },
})

export const runTest = async () => {
    console.log('Logging you in...')

    const {session} = await sessionKit.login()

    console.log('\nSuccessfully logged you in!')

    console.log('\nStarting transfer test...')

    await session.transact({action: makeMockAction()}, {broadcast: false})

    console.log('\nTransfer successful!')
}
