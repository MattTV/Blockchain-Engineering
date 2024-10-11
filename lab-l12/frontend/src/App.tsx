import React, { useState } from 'react'
import { Button, Typography, Container, CircularProgress, } from '@mui/material'

const KEY = '6dcc124be5f382be631d49ba12f61adbce33a5ac14f6ddee12de25272f943f8b'
const PORT = 3000
const SERVER_URL = `http://localhost:${PORT.toString()}`

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [transaction, setTransaction] = useState<Object | null>(null)

  const handleLogEventRequest = async () => {
    
    setIsLoading(true)

    try {
      const response = await fetch(`${SERVER_URL}/log-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( { eventData: 'test test' } )
      })

      setTransaction(await response.json())
      console.log(await response.json())

    } catch (error) {

      console.error(`Error while requesting event logging: ${error}`)

    } finally {

      setIsLoading(false)

    }

  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Frontend App
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogEventRequest}
        disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Send Event Log Request'}
        </Button>
      {/* {transaction && (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          TXID from backend: {transaction.TXID}
        </Typography>
      )} */}
    </Container>
  )
}

export default App
