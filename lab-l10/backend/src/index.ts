import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import Authrite from 'authrite-express'
import PacketPay from '@packetpay/express'

// Let TypeScript know there is possibly an authrite prop on incoming requests
declare module 'express-serve-static-core' {
  interface Request {
    authrite?: {
      identityKey: string
    }
    certificates?: any
  }
}

const app: Express = express()
const PORT = 3000

// TODO: Define the server private key and base URL
const PRIVATE_KEY = '0d7889a0e56684ba795e9b1e28eb906df43454f8172ff3f6807b8cf9464994df'
const SERVER_URL = `http://localhost:${PORT.toString()}`

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

// TODO (Optionally): Configure non-protected routes

// TODO: Configure the express server to use the authrite middleware
app.use(Authrite.middleware({
  serverPrivateKey: PRIVATE_KEY,
  baseUrl: SERVER_URL,
}))

// Add packetpay middleware
app.use(PacketPay({
  serverPrivateKey: PRIVATE_KEY,
  ninjaConfig: {
    dojoURL: 'https://staging-dojo.babbage.systems',
  },
  calculateRequestPrice: (req: Request) => {
    if (req.originalUrl === '/weather') {
      return 333
    } else {
      return 200
    }
  }
}))

// TODO: Configure protected route
app.post('/protected', (req, res) => {
  res.json({
    message: 'Your message was received',
    clientData: req.body,
  })
})

app.post('/weather', async (req, res) => {

  console.log('weather request received')

  // verify the payment
  if (req.packetpay.satoshisPaid === 333) {

    console.log('correct payment for weather received')

    // return data
    try {
      const response = await fetch('https://openweathermap.org/data/2.5/weather?id=5746545&appid=439d4b804bc8187953eb36d2a8c26a02', { method: 'GET' })
      const weatherData = await response.json()

      console.log(weatherData)

      res.json(weatherData)
    } catch (error) {
      console.error('Error fetching weather data: ', error)
      res.status(500).json({ error: 'Failed to fetch weather data' })
    }
  } else {

    console.log('payment not verified')

    res.status(400).json({
      message: 'Payment for weather data request not received',
    })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
