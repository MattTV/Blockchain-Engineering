import React, { useState } from 'react'
import { Button, Typography, Container, CircularProgress, Card, CardContent } from '@mui/material'
import { AuthriteClient } from 'authrite-js'
import PacketPay from '@packetpay/js'

const KEY = '6dcc124be5f382be631d49ba12f61adbce33a5ac14f6ddee12de25272f943f8b'
const PORT = 3000
const SERVER_URL = `http://localhost:${PORT.toString()}`

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [weather, setWeather] = useState<any | null>(null)

  const handleWeatherRequest = async () => {
    
    setIsLoading(true)

    try {
      // use packetpay to request weather report
      const response = await PacketPay(`${SERVER_URL}/weather`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      setWeather(await response.json())
      console.log(await response.json())

    } catch (error) {

      console.error(`Error while requesting weather data ${error}`)

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
        onClick={handleWeatherRequest}
        disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Send Weather Request'}
        </Button>
      {response && (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          Response from backend: {response}
        </Typography>
      )}
      {weather && (
        <Card>
          <CardContent>
            <Typography variant='h4'>{weather.name} Weather</Typography>
            <Typography variant='h6'>Temp: {weather.main.temp} °C</Typography>
            <Typography variant='body2'>High: {weather.main.temp_max} °C</Typography>
            <Typography variant='body2'>Low: {weather.main.temp_min} °C</Typography>
            <Typography variant='body2'>Humidity: {weather.main.humidity}%</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default App
