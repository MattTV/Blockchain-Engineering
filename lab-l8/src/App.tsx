import React, { useEffect, useState } from 'react'
import { Box, Container, TextField, Button, List, Card, CardContent, Typography, Grid, CardActions, MenuItem, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material'
// TODO: Import necessary modules from PushDrop and Babbage SDK
import { createAction, getTransactionOutputs, CreateActionResult, EnvelopeApi, EnvelopeEvidenceApi } from '@babbage/sdk-ts'
import pushdrop from 'pushdrop'
import { v4 as uuidv4 } from 'uuid'

// Define the structure of a card
interface CardData {
  name: string
  description: string
  rarity: string
  ability: string
  history: string
  sats: number
  txid: string
  outputIndex: number
  outputScript: string
  keyID: string
  envelope: EnvelopeApi | undefined
}

// TODO: Generate a unique key ID for each card
const generateUniqueKeyID = () => {
  return uuidv4()
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [cardName, setCardName] = useState('')
  const [cardDescription, setCardDescription] = useState('')
  const [cardRarity, setCardRarity] = useState('')
  const [cardAbility, setCardAbility] = useState('')
  const [history, setHistory] = useState<string>('')
  const [sats, setSats] = useState<number>(1)
  const [cards, setCards] = useState<CardData[]>([])
  const [creatingCard, setCreatingCard] = useState<boolean>(false)

  // Load existing cards when the component mounts
  useEffect(() => {
    loadCards()
  }, [])

  // TODO: Create a new card token
  const handleCreateCard = async (e: any) => {
  
    setIsLoading(true)

    // Generate a key
    const cardKey = generateUniqueKeyID()

    try {
      const outputScript = await pushdrop.create({
        fields: [
          Buffer.from(cardName),
          Buffer.from(cardDescription),
          Buffer.from(cardRarity),
          Buffer.from(cardAbility),
        ],
        protocolID: 'card collectibles',
        keyID: cardKey,
      })

      const instructions = {
        keyID: cardKey,
        history: ''
      }

      const newCardToken: CreateActionResult = await createAction({
        outputs: [{
          satoshis: sats,
          script: outputScript,
          basket: 'game_collectibles',
          customInstructions: JSON.stringify(instructions)
        }],
        description: 'Creating a new card',
      })

      const newEnvelope: EnvelopeApi = {
        rawTx: newCardToken.rawTx || '',
        inputs: newCardToken.inputs as Record<string,EnvelopeEvidenceApi>,
        txid: newCardToken.txid,
        mapiResponses: newCardToken.mapiResponses,
      }

      // add the new card to the set of cards
      const newCard: CardData = {
        name: cardName,
        description: cardDescription,
        rarity: cardRarity,
        ability: cardAbility,
        history: '',
        sats: sats,
        txid: newCardToken?.txid ? newCardToken.txid : '',
        outputIndex: 0,
        outputScript: outputScript,
        keyID: cardKey,
        envelope: newEnvelope,
      }
      
      //setCards( cards => [...cards, newCard] )
      loadCards()

      setIsLoading(false)
      setCreatingCard(false)

    } catch (e) {
      console.error(`Create Card Error: ${(e as Error).message}`)
    }
  }

  // Load the cards from the "game_collectibles" basket
  const loadCards = async () => {
    
    setCards([])
    // TODO: Use getTransactionOutputs to retrieve cards from the basket
    const cardOutputs = await getTransactionOutputs({
      basket: 'game_collectibles',
      spendable: true,
      includeEnvelope: true,
    })

    // TODO: Decode the cards and store them in state
    // TODO: Set the cards state variable
    await Promise.all(cardOutputs.map(async (card: any) => {
      try {

        const decodedCard = await pushdrop.decode({
          script: card.outputScript,
          fieldFormat: 'utf8',
        })

        const cardInstructions = JSON.parse(card.customInstructions)

        const finalCard: CardData = {
          name: decodedCard.fields[0],
          description: decodedCard.fields[1],
          rarity: decodedCard.fields[2],
          ability: decodedCard.fields[3],
          history: cardInstructions.history,
          sats: card.amount,
          txid: card.txid,
          outputIndex: 0,
          outputScript: card.outputScript,
          keyID: cardInstructions.keyID,
          envelope: card.envelope,
        }

        setCards( cards => [...cards, finalCard] )

      } catch(e) {
        console.error(`Load Cards Error: ${(e as Error).message}`)
      }
    }))
  }

  // Redeem a card by unlocking it on the blockchain
  const handleRedeemCard = async (card: CardData) => {
    setIsLoading(true)
    try {
      // TODO: Use pushdrop.redeem to create an unlocking script
      const unlockScript = await pushdrop.redeem({
        protocolID: 'card collectibles',
        keyID: card.keyID,
        prevTxId: card.txid,
        outputIndex: card.outputIndex,
        lockingScript: card.outputScript,
        outputAmount: card.sats,
      })

      // TODO: Use createAction to create a new transaction that redeems the card
      await createAction({
        inputs: {
          [card.txid]: {
            ...card.envelope,
            outputsToRedeem: [{
              index: 0,
              unlockingScript: unlockScript,
            }]
          }
        },
        description: 'Redeeming a card'
      })

      // Reload the cards after redeeming
      loadCards()
    } catch (error) {
      console.error('Error redeeming card:', error)
    }
    setIsLoading(false)
  }

  return (
    <Container maxWidth="md" sx={{ paddingTop: '3em' }}>
      <Typography align='center' variant="h3" gutterBottom>
        Collectible Card Creator
      </Typography>

      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Button variant='contained' onClick={() => { setCreatingCard(true) }}>Create Card</Button>
      </Box>

      <br></br>

      <Grid container sx={{display: 'flex', justifyContent: 'center'}}>
        {/* TODO: Create a form for new cards, and display existing cards */}
        {cards.map((card) => {
          return (
            <Card key={card.keyID} sx={{minWidth: 200, maxWidth: 200, margin: 1}}>
              <CardContent>
                <Typography variant="h5">{card.name}</Typography>
                <Typography>{card.description}</Typography><br></br>
                <Typography>Rarity: {card.rarity}</Typography>
                <Typography>Ability: {card.ability}</Typography>
                <Typography>Value: {card.sats} Satoshis</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => { handleRedeemCard(card) }}>Redeem</Button>
              </CardActions>
            </Card>
          )
        })}


        {/* Dialog to create a new card */}
        <Dialog open={creatingCard} onClose={() => { setCreatingCard(false) }}>
          <DialogTitle>Create a Card</DialogTitle>
          <DialogContent>
            <form onSubmit={(e) => {
              e.preventDefault()
              void (async () => {
                try {
                  await handleCreateCard(e)
                } catch ( error) {
                  console.error('Error in new card form submission: ', error)
                }
              })()
            }}>
              <TextField
                type='string'
                label='Name'
                onChange={(e: { target: { value: any } }) => { setCardName(e.target.value) }}
                value={cardName}
              /><br></br><br></br>
              <TextField
                type='string'
                label='Description'
                multiline
                rows={3}
                onChange={(e: { target: { value: any } }) => { setCardDescription(e.target.value) }}
                value={cardDescription}
              /><br></br><br></br>
              <TextField
                type='string'
                label='Rarity'
                onChange={(e: { target: { value: any } }) => { setCardRarity(e.target.value) }}
                value={cardRarity}
              /><br></br><br></br>
              <TextField 
                type='string'
                label='Ability'
                onChange={(e: { target: { value: any } }) => { setCardAbility(e.target.value) }}
                value={cardAbility}
              /><br></br><br></br>
              <TextField
                type='number'
                label='Value (Satoshis)'
                onChange={(e: { target: { value: any} }) => { setSats(Number(e.target.value)) }}
                value={sats}
              /><br></br><br></br>
              <DialogActions>
                <Button onClick={() => { setCreatingCard(false) }}>Cancel</Button>
                <Button type='submit'>Create</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Grid>
    </Container>
  )
}

export default App
