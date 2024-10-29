//@ts-check
const { exit } = require("process")
const { SERVER_ADDRESS, SERVER_PORT } = require("../Data/constants.js")

const Database = require("./database")
const express = require('express')
const path = require('path')

const database = new Database()
const app = express()

console.log(`Exposing ${path.join(path.dirname(__dirname), "/Data")}`)
app.use("/Data", express.static(path.join(path.dirname(__dirname), "/Data")))
app.use(express.json())

/** @type {boolean} */
let isDatabaseReady = false;

for (let i = 0; i < process.argv.length; i++) {
	if(process.argv[i] == "export-media") {

		if (database.fetchFromDisk()) {
			console.error("\x1B[31m[DATABASE] Error fetching from disk, exiting...\x1B[0m")
			exit(1);
		}

		if(database.exportMedia()) {
			console.error(`\x1B[31m[DATABASE] Failed to export media\x1B[0m`);
			exit(1);
		}

		exit(0);
	}
}

app.listen(SERVER_PORT, () => {
    console.log("Starting backend...")

    if (database.fetchFromDisk()) {
        console.error("\x1B[31m[DATABASE] Error fetching from disk, exiting...\x1B[0m")
        exit(1);
    }

	database.updatePathesToRelative();

    console.log("[DATABASE] Fetching successfull!")
    isDatabaseReady = true;

    console.log(`Backend ready at http://${SERVER_ADDRESS}:${SERVER_PORT}/`)
})

app.get('/istituti', (req, res) => {
    console.log(`[${req.ip ?? '??'}] (/istituti) Requested all institutes`)

    const institutes = database.getInstitutes();
    res.json(institutes);
})

app.get('/sedi', (req, res) => {
    console.log(`[${req.ip ?? '??'}] (/sedi) Requested all sedi`)

    /** @type {Array<import('./database').Sede>} */
    let sedi = [];

    const INSTITUTES = database.getInstitutes();
    INSTITUTES.forEach(institute => sedi.push(...institute.sedi));

    res.json(sedi);
})

app.get('/opendays', (req, res) => {
    console.log(`[${req.ip ?? '??'}] (/istituti) Requested all opendays`)

    const opendays = database.getOpenDays();
    res.json(opendays);
})

app.get('/istituto/:id', (req, res) => {
    /** @type {string} */
    const INSTITUTE_ID = req.params.id;

    console.log(`[${req.ip ?? '??'}] (/istituto/${INSTITUTE_ID}) Requested institute`)

    const INSTITUTE = database.getInstituteByID(INSTITUTE_ID);
    res.json(INSTITUTE);
})

app.get('/sede/:id', (req, res) => {
    /** @type {string} */
    const SEDE_ID = req.params.id;

    console.log(`[${req.ip ?? '??'}] (/sede/${SEDE_ID}) Requested sede...`)

    const SEDE = database.getSedeByID(SEDE_ID);
    res.json(SEDE);
})

app.get('/opendays/:id', (req, res) => {
    /** @type {string} */
    const OPENDAY_ID = req.params.id;

    console.log(`[${req.ip ?? '??'}] (/opendays/${OPENDAY_ID}) Requested openday...`)

    const OPENDAYS = database.getOpenDayByID(OPENDAY_ID);
    res.json(OPENDAYS);
})

app.get('/updateDB', (req, res) => {
    console.warn(`\x1B[33m[${req.ip ?? '??'}] (/updateDB) Updating database\x1B[0m`)

    if (database.fetchFromDisk())
	{
        res.sendStatus(500)
        isDatabaseReady = false;
        console.error(`\x1B[31m[${req.ip ?? '??'}] (/updateDB) Failed!, using backup data...\x1B[0m`)
    } else {
        res.sendStatus(200)
        isDatabaseReady = true;
        console.log(`[${req.ip ?? '??'}] (/updateDB) Successfull update`)
    }
})

app.get('/healthcheck', (req, res) => {
    if (isDatabaseReady)
	{
        res.status(200).send("ok")
        console.info(`\x1B[34m[${req.ip ?? '??'}] (HEALTH) Ok\x1B[0m`)
    }
	else
	{
        res.status(500).send("Database not ready")
		console.error(`\x1B[31m[${req.ip ?? '??'}] (HEALTH) Database not ready!\x1B[0m`)
    }

})

app.get('*', (req, res) => {
    console.log(`Someone hitted an invalid endpoint... '${req.url}'`)
    res.status(404).send(`EndPoint not existant --- Se vuoi connetterti alla pagina web visita 'https://${SERVER_ADDRESS}'`)
})
