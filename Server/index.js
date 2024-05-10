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

app.listen(SERVER_PORT, SERVER_ADDRESS, () => {
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
    console.log(`[${req.hostname}] (/instituti) Requested all institutes`)

    const institutes = database.getInstitutes();
    res.json(institutes);
})

app.get('/sedi', (req, res) => {
    console.log(`[${req.hostname}] (/sedi) Requested all sedi`)

    /** @type {Array<import('./database').Sede>} */
    let sedi = [];

    const INSTITUTES = database.getInstitutes();
    INSTITUTES.forEach(institute => sedi.push(...institute.sedi));

    res.json(sedi);
})

app.get('/institute/:id', (req, res) => {
    /** @type {string} */
    const INSTITUTE_ID = req.params.id;

    console.log(`[${req.hostname}] (/institute/${INSTITUTE_ID}) Requested institute`)

    const INSTITUTE = database.getInstituteByID(INSTITUTE_ID);
    res.json(INSTITUTE);
})

app.get('/sede/:id', (req, res) => {
    /** @type {string} */
    const SEDE_ID = req.params.id;

    console.log(`[${req.hostname}] (/sede/${SEDE_ID}) Requested sede...`)

    const SEDE = database.getSedeByID(SEDE_ID);
    res.json(SEDE);
})

app.get('/updateDB', (req, res) => {
    console.warn(`[${req.hostname}] (/updateDB) Updating database`)

    if (database.fetchFromDisk()) {
        res.sendStatus(500)
        isDatabaseReady = false;
        console.error(`[${req.hostname}] (/updateDB) Failed!`)

    } else {
        res.sendStatus(418)
        console.log(`[${req.hostname}] (/updateDB) Successfull update`)
    }
})

app.get('/healthcheck', (req, res) => {
    if (isDatabaseReady) {
        res.sendStatus(200)

        console.info("[HEALTH] Ok")
        return
    }

    console.error("[HEALTH] ERROR")
})

// app.get('*', (req, res) => {
//     res.status(404).send('Page not found :(')
// })