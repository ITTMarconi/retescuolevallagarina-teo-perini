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

app.listen(SERVER_PORT, () => {
    console.log("Starting backend...")

    if (database.fetchFromDisk()) {
        console.error("[DATABASE] Error fetching from disk, exiting...")
        exit(1);
    }

    console.log("[DATABASE] Fetching successfull!")
    isDatabaseReady = true;

    console.log(`Backend ready at http://${SERVER_ADDRESS}:${SERVER_PORT}/`)
})

app.get('/instituti', (req, res) => {
    console.log(`[${req.ip ?? '??'}] (/instituti) Requested all institutes`)

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

app.get('/institute/:id', (req, res) => {
    /** @type {string} */
    const INSTITUTE_ID = req.params.id;

    console.log(`[${req.ip ?? '??'}] (/institute/${INSTITUTE_ID}) Requested institute`)

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

app.get('/updateDB', (req, res) => {
    console.warn(`[${req.ip ?? '??'}] (/updateDB) Updating database`)

    if (database.fetchFromDisk())
	{
        res.sendStatus(500)
        isDatabaseReady = false;
        console.error(`[${req.ip ?? '??'}] (/updateDB) Failed!`)
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
        console.info(`[${req.ip ?? '??'}] (HEALTH) Ok`)
    }
	else
	{
        res.status(500).send("Database not ready")
		console.error(`[${req.ip ?? '??'}] (HEALTH) Database not ready!`)
    }

})

app.get('*', (req, res) => {
    res.status(404).send(`EndPoint not existant --- Se vuoi connetterti alla pagina web visita 'https://${SERVER_ADDRESS}'`)
})
