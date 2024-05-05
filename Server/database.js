//@ts-check

const path = require('path')
const fs = require('fs');

/** @typedef {import("../Data/types").Mail} Mail */
/** @typedef {import("../Data/types").Phone} Phone */
/** @typedef {import("../Data/types").Contacts}  Contacts */
/** @typedef {import("../Data/types").Position} Position */
/** @typedef {import("../Data/types").Sede} Sede */
/** @typedef {import("../Data/types").Institute} Institute */
/** @typedef {import("../Data/types").Orario} Orario */
/** @typedef {import("../Data/types").OpenDay} OpenDay */

module.exports = class Database {
	/** @type {Array<Institute>} */
	_institutes_database = [];

	/** @type {Array<OpenDay>} */
	_opendays_database = [];

	/** @returns {boolean} - returns true if an error occurred */
	fetchFromDisk() {
		/** @type {Array<Institute>} */
		let institute_db_swap = [];

		/** @type {Array<OpenDay>} */
		let opendays_db_swap = [];


		//* Read folder
		/** @type {Array<string>} */
		let ISTITUTE_DIR;

		/** @type {string} */
		const INSTITUTES_PATH = "../Data/Istituti";

		try {
			ISTITUTE_DIR = fs.readdirSync(INSTITUTES_PATH);
		} catch (error) {
			console.error(`Could not read '${INSTITUTES_PATH}' directory\n${error}`);
			return true;
		}

		//@ts-ignore
		ISTITUTE_DIR.forEach(institute_id => {
			/** @type {string} */
			const INSTITUTE_PATH = path.join(INSTITUTES_PATH, institute_id)

			//* Institute Data
			const INSTITUTE_DATA_PATH = path.join(INSTITUTE_PATH, "data.json")

			/** @type {Buffer} */
			let institute_data_raw;
			try {
				institute_data_raw = fs.readFileSync(INSTITUTE_DATA_PATH)
			} catch (error) {
				console.error(`Could not read '${INSTITUTE_DATA_PATH}' file\n${error}`);
				return true;
			}

			/** @type {Institute} */
			let institute_data;
			try {
				institute_data = JSON.parse(institute_data_raw.toString());
			} catch (error) {
				console.error(`Could not parse '${institute_id}' data file\n${error}`);
				return true;
			}
			institute_db_swap.push(institute_data);

			//* Open day Data
			const INSTITUTE_OPENDAY_PATH = path.join(INSTITUTE_PATH, "open_day.json")

			/** @type {Buffer} */
			let institute_openday_raw;
			try {
				institute_openday_raw = fs.readFileSync(INSTITUTE_OPENDAY_PATH)
			} catch (error) {
				console.error(`Could not read '${INSTITUTE_OPENDAY_PATH}' file\n${error}`);
				return true;
			}

			/** @type {OpenDay} */
			let institute_opendays;
			try {
				institute_opendays = JSON.parse(institute_openday_raw.toString());
			} catch (error) {
				console.error(`Could not parse '${institute_id}' open_day file\n${error}`);
				return true;
			}
			opendays_db_swap.push(institute_opendays);

			//* Logo
			const LOGO_PATH = path.join(INSTITUTE_PATH, "logo.png")
			if (fs.existsSync(LOGO_PATH)) {
				institute_data.logo_url = LOGO_PATH;
			} else {
				console.warn(`File '${LOGO_PATH}' does not exist`)
			}

			//* Video
			const VIDEO_PATH = path.join(INSTITUTE_PATH, "video.mp4")
			if (fs.existsSync(VIDEO_PATH)) {
				institute_data.video_url = VIDEO_PATH;
			} else {
				console.warn(`File '${VIDEO_PATH}' does not exist`)
			}
		})

		this._institutes_database = institute_db_swap;
		this._opendays_database = opendays_db_swap;
		console.info(`Loaded ${this._institutes_database.length} institutes`)
		console.info(`Loaded ${this._opendays_database.length} opendays`)
		return false;
	}

	/** @returns {Array<Institute>} */
	getInstitutes() {
		return this._institutes_database;
	}

	/** @returns {Array<OpenDay>} */
	getOpenDays() {
		return this._opendays_database;
	}

	/** 
	 * @param id {string}
	 * @returns {Sede | null} */
	getSedeByID(id) {
		console.log("Requested sede: " + id);

		for (const institute of this._institutes_database) {
			for (const sede of institute.sedi) {
				if (sede.codice_MIUR === id) {
					console.log("Found sede!");
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
		console.log("Requested istitute: " + id);

		for (const institute of this._institutes_database) {
			for (const sede of institute.sedi) {
				if (sede.codice_MIUR === id) {
					console.log("Found institute!");
					return institute;
				}
			}
		}

		return null;
	}

	// 	getSchool(id)
	// 	getInstitute(id)

	// 	searchSchool(name)
	// 	searchInstitute(name)
}

