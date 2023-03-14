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
            id: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
            url: 'https://eos.greymass.com',
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

    const {signatures} = await session.transact({action: makeMockAction()}, {broadcast: false})

    if (signatures.length > 0) {
        console.log('\nTransfer successful!')
    } else {
        console.log('\nTransfer failed!')
    }
}
