import {SessionKit, WalletPluginPrivateKey} from '@wharfkit/session'

import {ConsoleUserInterface} from './user-interface'

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

export const wharfCommands = () => {
    program
        .command('login')
        .description('Login to the service')
        .action(async () => {
            console.log('Logging you in...')

            const response = await sessionKit.login()
        })

    program
        .command('transact')
        .description('Perform a transaction')
        .action(() => {
            console.log("Transact hasn't been implemented yet.")
        })

    program.parse(process.argv)
}
