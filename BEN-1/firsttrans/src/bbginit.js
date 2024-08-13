import { createAction } from "@babbage/sdk-ts"
import { create, redeem } from 'pushdrop'

async function firstTransaction()
{
    const bitcoinOutputScript = await create({
        fields: [
            Buffer.from('My first token'),
            Buffer.from('I\'m Matt')
        ],
        protocolID: 'first token',
        keyID: '1'
    })
    
    const newToken = await createAction({
        outputs: [{
            satoshis: 1000,
            script: bitcoinOutputScript
        }],
    
        description: 'Creating my first token'
    })
}

export { firstTransaction }