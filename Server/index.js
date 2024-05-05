//@ts-check
const { exit } = require('process');

const Database = require("./database")
const express = require('express')
const path = require('path')

const database = new Database()
const app = express()

const PORT = 25565

console.log(`Exposing ${path.join(path.dirname(__dirname), "/Data")}`)
app.use("/Data", express.static(path.join(path.dirname(__dirname), "/Data")))
app.use(express.json())

/** @type {boolean} */
let isDatabaseReady = false;

app.listen(PORT, () => {
    console.log("Starting backend...")

    if (database.fetchFromDisk()) {
        console.log(`Error fetching from disk, exiting...`)
        exit(1);
    }

    isDatabaseReady = true;

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

app.get('/institute/:id', (req, res) => {
    /** @type {string} */
    const INSTITUTE_ID = req.params.id;

    console.log(`Requested institute ${INSTITUTE_ID} from ${req.hostname}`)

    const INSTITUTE = database.getInstituteByID(INSTITUTE_ID);
    res.json(INSTITUTE);
})

app.get('/sede/:id', (req, res) => {
    /** @type {string} */
    const SEDE_ID = req.params.id;

    console.log(`Requested school ${SEDE_ID} from ${req.hostname}`)

    const SEDE = database.getSedeByID(SEDE_ID);
    res.json(SEDE);
})

app.get('/opendays', (req, res) => {
    console.log(`Requested open days from ${req.hostname}`)

    const opendays = database.getOpenDays();
    res.json(opendays);
})

// app.get('/video/:id', (req, res) => {
//     /** @type {string} */
//     const VIDEO_ID = req.params.id;
//     console.log(`Requested video ${VIDEO_ID} from ${req.hostname}`)
//     if (VIDEO_ID == null || VIDEO_ID == undefined) {
//         res.status(400).send("Video id not given")
//         return
//     }

//     /** @type {import("./database").Institute | null} */
//     const INSTITUTE = database.searchInstituteByID(VIDEO_ID);
//     if (INSTITUTE == null) {
//         res.status(400).send(`Institute ${VIDEO_ID} not found, check the id again!`)
//         return
//     }

//     // const AUTHORIZED_FILES = ["logo.png", "video.mp4"]
//     // let isAuthorised = AUTHORIZED_FILES.some(file => req.url.includes(file))
//     // if (isAuthorised) next()

//     //@ts-ignore
//     console.log(`Sending video at '${path.join(__dirname, INSTITUTE.video_url)}'...`)
//     res.sendFile(path.join(__dirname, INSTITUTE.video_url))
//     console.log("Sent!")
// })

// app.get('/logo/:id', (req, res) => {
//     /** @type {string} */
//     const LOGO_ID = req.params.id;
//     console.log(`Requested logo ${LOGO_ID} from ${req.hostname}`)
//     if (LOGO_ID == null || LOGO_ID == undefined) {
//         res.status(400).send("Logo id not given")
//         return
//     }

//     /** @type {import("./database").Institute | null} */
//     const INSTITUTE = database.searchInstituteByID(LOGO_ID);
//     if (INSTITUTE == null) {
//         res.status(400).send(`Institute ${LOGO_ID} not found, check the id again!`)
//         return
//     }

//     //@ts-ignore
//     console.log(`Sending logo at '${path.join(__dirname, INSTITUTE.logo_url)}'...`)
//     res.sendFile(path.join(__dirname, INSTITUTE.logo_url))
//     console.log("Sent!")
// })

app.get('/updateDB', (req, res) => {
    console.warn(`Requested to update db from ${req.hostname}`)

    if (database.fetchFromDisk()) {
        res.sendStatus(500)
        isDatabaseReady = false;
    } else {
        res.sendStatus(418)
    }
})

app.get('/healthcheck', (req, res) => {
    if (isDatabaseReady) {
        res.sendStatus(200)
    }
})

// app.get('*', (req, res) => {
//     res.status(404).send('Page not found :(')
// })