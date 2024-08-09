const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Sup')
})

app.listen(port, () => {
    console.log(`Example Express app listening on port ${port}`)
})