import {Action, Asset, Name, Struct} from '@wharfkit/session'

import {mockAccountName, mockPermissionName} from './mock-config'

@Struct.type('transfer')
class Transfer extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') to!: Name
    @Struct.field('asset') quantity!: Asset
    @Struct.field('string') memo!: string
}

export function makeMockAction(memo?: string): Action {
    // Generate typed data for action data
    const transfer = Transfer.from({
        from: mockAccountName,
        to: 'teamgreymass',
        quantity: '0.1337 EOS',
        memo: memo || 'wharfkit is the best <3',
    })
    // Assemble action with action data and metadata
    const action = Action.from({
        authorization: [
            {
                actor: mockAccountName,
                permission: mockPermissionName,
            },
        ],
        account: 'eosio.token',
        name: 'transfer',
        data: transfer,
    })
    return action
}
