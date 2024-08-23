import { createAction, toBEEFfromEnvelope } from '@babbage/sdk-ts'
import HelloWorldToken from 'hello-tokens'

(async function helloWorld() {
// Create output script with helper lib
const helloScript = await HelloWorldToken.createOutputScript("Hey Matt!")

// Create token with small value
const helloToken = await createAction({
    outputs: [{
        satoshis: 1,
        script: helloScript,
        description: "A hello world token",
    }],
    description: "Creating a hello world overlay-tracked token",
})

// Convert to BEEF
const beef = toBEEFfromEnvelope({
    rawTx: helloToken.rawTx,
    inputs: helloToken.inputs,
    txid: helloToken.txid,
}).beef

// Submit to Overlay Service
const resultOS = await
fetch('https://staging-overlay.babbage.systems/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream',
        'X-Topics': JSON.stringify(['tm_helloworld'])
    },
    body: new Uint8Array(beef)
})

// Query status of token from Lookup Service
const resultLS = await
fetch('https://staging-overlay.babbage.systems/lookup', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        service: 'ls_helloworld',
        query: 'Hey Matt!',
    })
})

// Parse answer from Lookup Service
const lookupAnswer = await resultLS.json()
console.log(HelloWorldToken.parseLookupAnswer(lookupAnswer))
})()