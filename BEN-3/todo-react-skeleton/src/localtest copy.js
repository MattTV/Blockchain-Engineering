const Tokenator = require('@babbage/tokenator')
const johnSmith = '032e28dfd0f37cbae85248aee3603b82c22eb60baa9ff399d7b0dedbb50e7eab81'

const init = async () => {
    // Create a new instance of the PushDropTokenator class
    // Configure the parameters according to the protocol being used
    const tokenator = new Tokenator({
        peerServHost: 'https://staging-peerserv.babbage.systems'
    })
    // Send a generic message using Babbage
    await tokenator.sendMessage({
        recipient: johnSmith,
        messageBox: 'example_inbox',
        body: 'This is an example message!'
    })

    // John can now list messages in his messageBox on PeerServ
    const messages = await tokenator.listMessages({
        messageBox: 'example_inbox'
    })

    console.log(messages[0].body) // --> 'This is an example message!'

    // Acknowledge that the messages have been received and can be deleted.
    await tokenator.acknowledgeMessage({  
        messageIds: messages.map(x => x.messageId)
    })
}

init()

// const Tokenator = require('@babbage/tokenator')
// const mattKey = '032e28dfd0f37cbae85248aee3603b82c22eb60baa9ff399d7b0dedbb50e7eab81'

// let tokenator

// // Initialize on component mount
// const Init = async () => {

//     tokenator = new Tokenator({
//         perServHost: 'https://staging-peerserv.babbage.systems'
//     })

// }

// const sendMsg = async (event) => {

//     await tokenator.sendMessage({
//         recipient: mattKey,
//         messageBox: 'exampleMsgs',
//         body: 'My balls itchingg'
//     })

// }

// const receiveMsgs = async (event) => {

//     let msgs = await tokenator.listMessages({
//         messageBox: 'exampleMsgs'
//     })

//     console.log(msgs)
//     console.log(msgs[0])
//     console.log(msgs[0]?.sender)

//     // msgs.array.forEach(msg => {
//     //     console.log(msg.body)
//     // });

//     await tokenator.acknowledgeMessage({
//         messageIds: msgs.map(x => x.messageId)
//     })

// }


// Init()
// sendMsg()
// receiveMsgs()
