/**
 * src/App.js
 * 
 * This file contains the primary business logic and UI code for the ToDo 
 * application.
 */
const Tokenator = require('@babbage/tokenator')
const mattKey = '032e28dfd0f37cbae85248aee3603b82c22eb60baa9ff399d7b0dedbb50e7eab81'
import React, { useState, useEffect } from 'react'
import {
  
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const App = () => {

  // tokenator object
  const [tokenator, setTokenator] = useState()

  // Initialize on component mount
  useEffect(() => {
    setTokenator(new Tokenator({
      perServHost: 'https://staging-peerserv.babbage.systems'
    }))
  }, [])

  const firsttest = async () => {

    await tokenator.sendMessage({
      recipient: mattKey,
      messageBox: 'exampleMsgs',
      body: 'My balls itch'
    })

    let msgs = await tokenator.listMessages({
          messageBox: 'exampleMsgs'
      })

    console.log(msgs)
    console.log(msgs[0])
    console.log(msgs[0]?.sender)
    console.log(msgs[0]?.body)

    await tokenator.acknowledgeMessage({
        messageIds: msgs.map(x => x.messageId)
    })
    
  }

  // User interface code
  return (
    <>
      <button onClick={firsttest}>Test!</button>
    </>
  )
}

export default App
