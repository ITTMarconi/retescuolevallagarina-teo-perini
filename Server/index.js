const Database = require("./database")
const express = require('express')
const path = require('path')

const database = new Database()
const app = express()
const PORT = 25565

__dirname = path.dirname(__dirname)
app.use(express.static(__dirname))
app.use(express.json())

app.listen(PORT, () => {
	console.log(`Backend online at http://localhost:${PORT}/`)
})

app.get('/institutes', (req, res) => {
	console.log(`Requested institutes from ${req.hostname}`)

	const institutes = database.getInstitutes();
	res.json(institutes);
})

app.get('/updateDB', (req, res) => {
	console.warn(`Requested to update db from ${req.hostname}`)

	if(database.fetchFromDisk("../Data")) {
		res.sendStatus(500)
	} else {
		res.sendStatus(418)
	}
})

app.get('*', (req, res) => {
	res.statusCode(404).send('Page not found :(')
})