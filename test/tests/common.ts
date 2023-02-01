import {mockFetch} from '$test/utils/mock-fetch'
import {UserInterfaceTEMPLATE} from '../../src/index'

import SessionKit, {
    PrivateKey,
    Session,
    SessionOptions,
    WalletPluginPrivateKey,
} from '@wharfkit/session'

const wallet = new WalletPluginPrivateKey({
    privateKey: PrivateKey.from('5Jtoxgny5tT7NiNFp1MLogviuPJ9NniWjnU4wKzaX4t7pL4kJ8s'),
})

const mockChain = {
    id: '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d',
    url: 'https://jungle4.greymass.com',
}

const mockSessionOptions: SessionOptions = {
    chain: mockChain,
    fetch: mockFetch,
    permissionLevel: 'wharfkit1131@test',
    ui: new UserInterfaceTEMPLATE(),
    walletPlugin: wallet,
}

const mockSessionKitOptions = {
    appName: 'unittests',
    chains: [mockChain],
    fetch: mockFetch,
    ui: new UserInterfaceTEMPLATE(),
    walletPlugins: [wallet],
}

suite('example', function () {
    test('interface perform login', async function () {
        const kit = new SessionKit(mockSessionKitOptions)
        await kit.login()
    })
    test('interface perform transaction', async function () {
        const session = new Session(mockSessionOptions)
        const action = {
            authorization: [
                {
                    actor: 'wharfkit1115',
                    permission: 'test',
                },
            ],
            account: 'eosio.token',
            name: 'transfer',
            data: {
                from: 'wharfkit1115',
                to: 'wharfkittest',
                quantity: '0.0001 EOS',
                memo: 'wharfkit plugin - resource provider test (maxFee: 0.0001)',
            },
        }
        await session.transact(
            {
                action,
            },
            {broadcast: false}
        )
    })
})
