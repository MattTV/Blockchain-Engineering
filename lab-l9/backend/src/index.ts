import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import Authrite from 'authrite-express'

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
const PORT: number = 3000

// TODO: Define the server private key and base URL
const PRIVATE_KEY: string = '0d7889a0e56684ba795e9b1e28eb906df43454f8172ff3f6807b8cf9464994df'
const SERVER_URL: string = `http://localhost:${PORT.toString()}`

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

// TODO: Configure protected route
app.post('/protected', (req, res) => {
  res.json({
    message: 'Your message was received',
    clientData: req.body,
  })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
