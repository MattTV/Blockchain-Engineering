import React, { useState } from 'react'
import { Button, Typography, Container, CircularProgress } from '@mui/material'
import { AuthriteClient } from 'authrite-js'

const KEY = '6dcc124be5f382be631d49ba12f61adbce33a5ac14f6ddee12de25272f943f8b'
const PORT = 3000
const SERVER_URL = `http://localhost:${PORT.toString()}`

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const handleButtonClick = async () => {
    // TODO: Create an instance of AuthriteClient and make a signed request to '/protected'
    
    setIsLoading(true)

    // Create an Authrite Client instance
    const authrite = new AuthriteClient(SERVER_URL, {
      clientPrivateKey: KEY,
    })

    // Create the body of the request
    const body = {
      user: 'Matt',
      message: 'Rocket League is goated',
    }

    // Create the request
    const res = await authrite.createSignedRequest('/protected', {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Parse the response
    setResponse(JSON.stringify(res))

    setIsLoading(false)
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Frontend App
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Send Request to Backend'}
      </Button>
      {response && (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          Response from backend: {response}
        </Typography>
      )}
    </Container>
  )
}

export default App
