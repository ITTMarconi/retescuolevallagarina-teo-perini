//@ts-check
const { exit } = require('process');

const Database = require("./database")
const express = require('express')
const path = require('path')

const database = new Database()
const app = express()
const PORT = 25565

app.use(express.static(__dirname))
app.use(express.json())

app.listen(PORT, () => {
	console.log("Starting backend...")

	if (database.fetchFromDisk()) {
		console.log(`Error fetching from disk, exiting...`)
		exit(1);
	}

	console.log(`Backend ready at http://localhost:${PORT}/`)
})

app.get('/instituti', (req, res) => {
	console.log(`Requested institutes from ${req.hostname}`)

	const institutes = database.getInstitutes();
	res.json(institutes);
})

app.get('/sedi', (req, res) => {
	console.log(`Requested schools from ${req.hostname}`)

	/** @type {Array<import('./database').Sede>} */
	let sedi = [];

	const INSTITUTES = database.getInstitutes();
	INSTITUTES.forEach(institute => sedi.push(...institute.sedi));

	res.json(sedi);
})

app.get('/opendays', (req, res) => {
	console.log(`Requested open days from ${req.hostname}`)

	const opendays = database.getOpenDays();
	res.json(opendays);
})

app.get('/video/:id', (req, res) => {
	/** @type {string} */
	const VIDEO_ID = req.params.id;
	console.log(`Requested video ${VIDEO_ID} from ${req.hostname}`)
	if (VIDEO_ID == null || VIDEO_ID == undefined) {
		res.status(400).send("Video id not given")
		return
	}

	/** @type {import("./database").Institute | null} */
	const INSTITUTE = database.searchInstituteByID(VIDEO_ID);
	if (INSTITUTE == null) {
		res.status(400).send(`Institute ${VIDEO_ID} not found, check the id again!`)
		return
	}

	//@ts-ignore
	console.log(`Sending video at '${path.join(__dirname, INSTITUTE.video_url)}'...`)
	res.sendFile(path.join(__dirname, INSTITUTE.video_url))
	console.log("Sent!")
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

	//@ts-ignore
	console.log(`Sending logo at '${path.join(__dirname, INSTITUTE.logo_url)}'...`)
	res.sendFile(path.join(__dirname, INSTITUTE.logo_url))
	console.log("Sent!")
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