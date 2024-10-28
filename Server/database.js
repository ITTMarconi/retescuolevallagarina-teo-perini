//@ts-check

const path = require('path')
const fs = require('fs');

const DATA_PATH = "../Data"

/** @typedef {import("../Data/types").Mail} Mail */
/** @typedef {import("../Data/types").Phone} Phone */
/** @typedef {import("../Data/types").Contacts}  Contacts */
/** @typedef {import("../Data/types").Position} Position */
/** @typedef {import("../Data/types").Sede} Sede */
/** @typedef {import("../Data/types").Institute} Institute */
/** @typedef {import("../Data/types").Orario} Orario */
/** @typedef {import("../Data/types").OpenDays} OpenDays */

/**
 * @param {string} path 
 * @returns {Object | true} - returns json object or true */
function read_JSON_from_file(path)
{
    /** @type {Buffer} */
    let raw;
    try {
        raw = fs.readFileSync(path)
    } catch (error) {
        console.error(`\x1B[31m[DATABASE] Could not read file '${path}': ${error}\x1B[0m`);
        return true;
    }

    let data;
    try {
        data = JSON.parse(raw.toString());
    } catch (error) {
        console.error(`\x1B[31m[DATABASE] Could not parse file as json '${path}': ${error}\x1B[0m`);
        return true;
    }

    return data
}

/** @returns {Object | true} - returns example data format */
function load_institute_data_format()
{
    let example_data = read_JSON_from_file(`${DATA_PATH}/example/new_data.json`)
    if(example_data === true) return true;
    return example_data;
}

/** 
 * @param lhs {Object} - fmt obj
 * @param rhs {Object} - data obj
 * @param path {string}
 * @returns {boolean} */
function do_obj_match(lhs, rhs, path, depth)
{
    let match = true;
    let lhs_keys = Object.keys(lhs)
    let rhs_keys = Object.keys(rhs)

    let indent = "\t".repeat(depth)

    if(lhs_keys[0] === '0')
    {
        // console.info(`\x1B[34m${indent}Evaluating array...\x1B[0m`)
        
        if(rhs_keys[0] === undefined)
        {
            return true;
        }
        else if (rhs_keys[0] !== '0')
        {
            console.error(`\x1B[31m${indent}Mismatched type, found array but evaluating object\x1B[0m`)
            return false;
        }

        for(let i = 0; i < rhs.length; ++i)
        {
            let sub = rhs[i]
            if(!do_obj_match(lhs['0'], sub, `${path}[${i}]`, depth + 1)) return false;
        }
    }
    else
    {
        /* Warn for missing keys */
        for(let key of lhs_keys.filter(key => !rhs_keys.includes(key)))
        {
            console.error(`\x1B[31m${indent}Missing key '${key}' while validating obj at '${path}'\x1B[0m`)
            return false;
        }

        /* Warn for extra keys */
        for(let key of rhs_keys.filter(key => !lhs_keys.includes(key)))
        {
            console.warn(`\x1B[33m${indent}Extra key '${key}' while validating obj at '${path}'\x1B[0m`)
            return false;
        }

        for(let key of lhs_keys.filter(key => rhs_keys.includes(key)))
        {
            if(typeof lhs[key] != typeof rhs[key]) {
                console.error(`\x1B[31m${indent}Mismatched type, found '${typeof rhs[key]}' but evaluating as '${lhs[key]}'\x1B[0m`)
                return false;
            }

            if(typeof lhs[key] == 'object') {
                // console.log(`${indent}Key '${key}' detected as obj`)
                match = do_obj_match(lhs[key], rhs[key], `${path}.${key}`, depth + 1)
        //    } else {
        //        console.log(`${indent}Same key '${key}' at '${path}'`)
            }
        }
    }

    return match;
}


/** 
 * @param format {Object}
 * @param data {Object}
 * @returns {boolean} - returns true if an error occurred */
function is_valid_institute_data(format, data)
{
    return do_obj_match(format, data, "istituto", 1)
}

module.exports = class Database {
    /** @type {Array<Institute>} */
    _database = [];

    /** @returns {boolean} - returns true if an error occurred */
    fetchFromDisk() {
        /** @type {Array<Institute>} */
        let database_swap = [];

        const institute_data_fmt = load_institute_data_format();
        if(institute_data_fmt === true) {
            console.error("\x1B[31m[DATABASE] Failed to load institute data format\x1B[0m")
            return true;
        }

        //* Read folder
        /** @type {Array<string>} */
        let ISTITUTE_DIR;

        /** @type {string} */
        const INSTITUTES_PATH = `${DATA_PATH}/Istituti`;

        try {
            ISTITUTE_DIR = fs.readdirSync(INSTITUTES_PATH);
        } catch (error) {
            console.error(`\x1B[31m[DATABASE] Could not read '${INSTITUTES_PATH}' directory\n${error}\x1B[0m`);
            return true;
        }

        //@ts-ignore
        for (let institute_id of ISTITUTE_DIR) {
            /** @type {string} */
            const INSTITUTE_PATH = path.join(INSTITUTES_PATH, institute_id)

            console.info(`\n\x1B[34m[DATABASE] Loading institute data at '${INSTITUTE_PATH}'\x1B[0m`)

            //* Institute Data
            const INSTITUTE_DATA_PATH = path.join(INSTITUTE_PATH, "data.json")

            /** @type {Institute | true} */
            let institute_data = read_JSON_from_file(INSTITUTE_DATA_PATH)
            if(!is_valid_institute_data(institute_data_fmt, institute_data)) {
                console.error(`\x1B[31m[DATABASE] Insitute data does not conform to example file\x1B[31m`);
                return true;
            }
            if(institute_data === true) return true;

            //* Logo
            const LOGO_PATH = path.join(INSTITUTE_PATH, "logo.png")
            if (fs.existsSync(LOGO_PATH)) {
                institute_data.logo_url = LOGO_PATH;
            } else {
                console.warn(`\x1B[33m[DATABASE] File '${LOGO_PATH}' does not exist\x1B[0m`)
            }

            //* Video
            const VIDEO_PATH = path.join(INSTITUTE_PATH, "video.mp4")
            if (fs.existsSync(VIDEO_PATH)) {
                institute_data.video_url = VIDEO_PATH;
            } else {
                console.warn(`\x1B[33m[DATABASE] File '${VIDEO_PATH}' does not exist\x1B[0m`)
            }

            //* OpenDays
            const INSTITUTE_OPENDAY_PATH = path.join(INSTITUTE_PATH, "open_day.json")

            /** @type {OpenDays | true} */
            let institute_opendays = read_JSON_from_file(INSTITUTE_OPENDAY_PATH)
            if(institute_opendays == true) return true;

            institute_data.openDays = institute_opendays;
            database_swap.push(institute_data);
        }

        this._database = database_swap;
        console.info(`\x1B[34m[DATABASE] Loaded ${this._database.length} institutes\x1B[0m`)
        return false;
    }

    /** @returns {Array<Institute>} */
    getInstitutes() {
        return this._database;
    }

    /** 
     * @param id {string}
     * @returns {Sede | null} */
    getSedeByID(id) {
        console.log(`[DATABASE] Requested sede (${id}), searching...`);

        for (const institute of this._database) {
            for (const sede of institute.sedi) {
                if (sede.codice_MIUR === id) {
                    console.log(`[DATABASE] Found sede!`);
                    return sede;
                }
            }
        }

        return null;
    }

    /** 
     * @param id {string}
     * @returns {Institute | null} */
    getInstituteByID(id) {
        console.log(`[DATABASE] Requested institute (${id}), searching...`);

        for (const institute of this._database) {
            for (const sede of institute.sedi) {
                if (sede.codice_MIUR === id) {
                    console.log(`[DATABASE] Found institute!`);
                    return institute;
                }
            }
        }

        return null;
    }
}

