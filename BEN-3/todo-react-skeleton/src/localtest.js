const Tokenator = require('@babbage/tokenator')
const mattKey = '032e28dfd0f37cbae85248aee3603b82c22eb60baa9ff399d7b0dedbb50e7eab81'

let tokenator
let mBox = "mattest"

// Initialize on component mount
const Init = async () => {

    tokenator = new Tokenator({
        perServHost: 'https://staging-peerserv.babbage.systems'
    })

    tokenator.initializeConnection({
        messageBox: mBox
    })

    tokenator.listenForLiveMessages({
        onMessage: receiveMsgs,
        messageBox: mBox
    })

}

const sendMsg = async (event) => {

    await tokenator.sendLiveMessage({
        message: 'My balls itchingg',
        recipient: mattKey,
        messageBox: mBox,
    })

}

const receiveMsgs = async (event) => {

    let msgs = await tokenator.listMessages({
        messageBox: mBox
    })

    // console.log(msgs)
    // console.log(msgs[0])
    // console.log(msgs[0]?.sender)
    // console.log(msgs[0]?.body)

    msgs.array.forEach(msg => {
        console.log(msg?.body)
    });

    await tokenator.acknowledgeMessage({
        messageIds: msgs.map(x => x.messageId)
    })

}

async function main()
{
    await Init()
    //await sendMsg()
    //receiveMsgs()
    sendMsg()
}

main()