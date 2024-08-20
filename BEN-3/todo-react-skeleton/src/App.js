/**
 * src/App.js
 * 
 * This file contains the primary business logic and UI code for the ToDo 
 * application.
 */
const Tokenator = require('@babbage/tokenator')
const mattKey = '032e28dfd0f37cbae85248aee3603b82c22eb60baa9ff399d7b0dedbb50e7eab81'
const lab3Key = '02be875d01cf0b4fa673a54a1919b3a055804c68930c6d5d5f67380e64093666f8'
const mBox = 'L3_inbox'
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
      recipient: lab3Key,
      messageBox: mBox,
      body: 'Lab L3 has been completed by Matt!'
    })

    let msgs = await tokenator.listMessages({
          messageBox: mBox
      })

    console.log(msgs)
    console.log(msgs[0])
    console.log(msgs[0]?.sender)
    console.log(msgs[0]?.body)

    await tokenator.acknowledgeMessage({
        messageIds: msgs.map(x => x.messageId) // Need to check if empty or not
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
