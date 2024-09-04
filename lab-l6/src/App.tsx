import React, { useState } from 'react'
import { Container, Typography, Grid, List, ListItem, ListItemText, Autocomplete, TextField } from '@mui/material'
import useAsyncEffect from 'use-async-effect'
import { discoverByIdentityKey, discoverByAttributes } from '@babbage/sdk-ts'
import { parseIdentity, TrustLookupResult, Identity } from 'identinator'

const App: React.FC = () => {
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [nameResults, setNameResults] = useState<string[]>([])
  
  // Use discoverByIdentityKey to resolve identity information.
  useAsyncEffect(async () => {
    const idresults = await discoverByIdentityKey({
      identityKey: '0294c479f762f6baa97fbcd4393564c1d7bd8336ebd15928135bbcf575cd1a71a1',
      description: 'Learning identity',
    })
    const id = idresults[0] as TrustLookupResult
    
    setIdentity(parseIdentity(id))
  }, [])

  // Use discoverByAttributes to search for matching identities
  useAsyncEffect(async () => {
    const results = await discoverByAttributes({
      attributes: {
        any: searchTerm,
      },
      description: 'Search for identities',
    })
    const lookupResults = results as TrustLookupResult[]

    const searchResults = lookupResults.map(result => parseIdentity(result))

    setNameResults(searchResults.map(result => result.name))
  }, [searchTerm])

  return (
    <Container maxWidth="sm" sx={{ paddingTop: '2em' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Resolved Identity Information</Typography>
        </Grid>
        {/* Display identity information here */}
          <List>
            <ListItem>
              <ListItemText
                primary={identity?.name}
                secondary={identity?.badgeLabel} />
            </ListItem>
          </List>
        {/* Implement search functionality */}
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            options={nameResults}
            renderInput={(params) => 
              <TextField
                {...params}
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            }
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default App