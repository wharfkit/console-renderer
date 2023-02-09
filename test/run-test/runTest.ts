import {SessionKit, WalletPluginPrivateKey} from '@wharfkit/session'

const {ConsoleUserInterface} = require('../../../lib/console-renderer')

const privateKey = '5JBGSx1XmPBf7n9QtCUhmwmw89pxgGqPz8cdAKZU6tYHNwAiLR3'

const sessionKit = new SessionKit({
    appName: 'wharf console app',
    chains: [
        {
            id: '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d',
            url: 'https://jungle4.greymass.com',
        },
    ],
    walletPlugins: [
        new WalletPluginPrivateKey({
            privateKey,
        }),
    ],
    ui: new ConsoleUserInterface(),
})

const program = require('commander')

export const runTest = async () => {
    console.log('Logging you in...')

    const {session} = await sessionKit.login()

    console.log('Successfully logged you in!')

    console.log('Starting transact test.. Transfering 0.0001 EOS.')

    session.transact({
        account: 'eosio',
        action: 'transfer',
        data: {
            to: 'teamgreymass',
            amount: '0.0001',
        },
    })

    console.log('Transfer successful!')
}
