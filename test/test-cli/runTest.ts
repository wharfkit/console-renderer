import {SessionKit} from '@wharfkit/session'
import {WalletPluginAnchor} from '@wharfkit/wallet-plugin-anchor'

import {mockChainId, mockUrl} from '../utils/mock-config'
import {makeMockAction} from '../utils/mock-actions'

const {ConsoleUserInterface} = require('../../../lib/console-renderer')

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
})

export const runTest = async () => {
    console.log('Logging you in...')

    const {session} = await sessionKit.login()

    console.log('\nSuccessfully logged you in!')

    console.log('\nStarting transfer test...')

    await session.transact({action: makeMockAction()}, {broadcast: false})

    console.log('\nTransfer successful!')
}
