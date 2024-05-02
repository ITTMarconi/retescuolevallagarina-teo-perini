const express = require('express')
const path = require('path')

const app = express()
const PORT = 3000

__dirname = path.dirname(__dirname)
app.use(express.static(__dirname))

app.listen(PORT, () => {
    console.log(`Example app listening on port ${port}!`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('*', (req, res) => {
    res.statusCode(404).send('Page not found :(')
})