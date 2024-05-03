//@ts-check

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

app.get('/logo/:id', (req, res) => {
	/** @type {string} */
	const LOGO_ID = req.params.id;
	console.log(`Requested logo ${LOGO_ID} from ${req.hostname}`)
	if (LOGO_ID == null || LOGO_ID == undefined) {
		res.status(400).send("Logo id not given")
		return
	}

	/** @type {import("./database").Institute | null} */
	const INSTITUTE = database.searchInstituteByID(LOGO_ID);
	if (INSTITUTE == null) {
		res.status(400).send(`Institute ${LOGO_ID} not found, check the id again!`)
		return
	}

	// Using the url send the image

	//@ts-ignore
	res.sendFile(INSTITUTE.logo_url)
})

app.get('/updateDB', (req, res) => {
	console.warn(`Requested to update db from ${req.hostname}`)

	if (database.fetchFromDisk()) {
		res.sendStatus(500)
	} else {
		res.sendStatus(418)
	}
})

app.get('*', (req, res) => {
	res.status(404).send('Page not found :(')
})