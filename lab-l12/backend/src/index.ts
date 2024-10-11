import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Ninja, NinjaV1Params } from 'ninja-base'
import { create } from 'pushdrop'

interface LogEventRequest {
  eventData: Record<string, any>
}
interface LogEventResponse {
  tx: any
  message: string
}

const app: Express = express()
const port = 3000

// TODO: Define the server private key
const serverPrivateKey = process.env.SERVER_PRIVATE_KEY
const dojoURL = 'https://staging-dojo.babbage.systems'

const serverParams: NinjaV1Params = {
  privateKey: serverPrivateKey,
  config: {
    dojoURL: dojoURL
  }
}

// TODO: Create a Ninja Wallet
const ninja = new Ninja(serverParams)

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// CORS Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Expose-Headers', '*')
  res.header('Access-Control-Allow-Private-Network', 'true')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.post('/log-event', async (req: Request, res: Response<LogEventResponse>) => {
  const { eventData } = req.body as LogEventRequest

  if (!eventData) {
    return res.status(400).json({ tx: '', message: 'Event data is required' })
  }

  try {
    // TODO: Collect request data
    const ipAddr = req.ip
    const time = Date.now()
    const endpoint = '/log-event'

    // TODO: Encrypt data

    // TODO: Generate key derivation info 
    // TODO: Create a pushdrop timestamp token
    const outputScript = await create({
      fields: [
        JSON.stringify(ipAddr),
        JSON.stringify(time),
        JSON.stringify(endpoint)
      ],
      protocolID: 'Event Log'
    })

    // TODO: Create a new Bitcoin transaction
    const newToken = await ninja.getTransactionWithOutputs({
      outputs: [
        {
          satoshis: 10,
          script: outputScript,
          description: '/log-event endpoint event'
        }
      ]
    })

    let tx = newToken.txid

    // Respond with the transaction ID
    res.status(200).json({ tx, message: 'Event logged on the blockchain' })
  } catch (error) {
    console.error('Error logging event:', error)
    res.status(500).json({ tx: '', message: 'Failed to log event on the blockchain' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
