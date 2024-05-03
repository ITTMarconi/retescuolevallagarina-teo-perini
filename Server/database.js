//@ts-check

const { exit } = require('process');
const path = require('path')
const fs = require('fs');

/** @typedef {import("../Data/types").Mail} Mail */
/** @typedef {import("../Data/types").Phone} Phone */
/** @typedef {import("../Data/types").Contacts}  Contacts */
/** @typedef {import("../Data/types").Position} Position */
/** @typedef {import("../Data/types").Sede} Sede */
/** @typedef {import("../Data/types").Institute} Institute */

module.exports = class Database {
	/** @type {Array<Institute>} */
	_database = [];

	Database() {
		if (this.fetchFromDisk()) {
			console.log(`Error fetching from disk, exiting...`)
			exit(1)
		}
	}

	/** @returns {boolean} - returns true if an error occurred */
	fetchFromDisk() {
		/** @type {Array<Institute>} */
		let database_swap = [];

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
			/** @type {Buffer} */
			let institute_data_raw;
			/** @type {Institute} */
			let institute_data;

			/** @type {string} */
			const INSTITUTE_PATH = path.join(INSTITUTES_PATH, institute_id)
			const INSTITUTE_DATA_PATH = path.join(INSTITUTE_PATH, "data.json")

			try {
				institute_data_raw = fs.readFileSync(INSTITUTE_DATA_PATH)
			} catch (error) {
				console.error(`Could not read '${INSTITUTE_DATA_PATH}' file\n${error}`);
				return true;
			}

			try {
				institute_data = JSON.parse(institute_data_raw.toString());
			} catch (error) {
				console.error(`Could not parse '${institute_id}' file\n${error}`);
				return true;
			}

			const LOGO_PATH = path.join(INSTITUTE_PATH, "logo.png")
			if (fs.existsSync(LOGO_PATH)) {
				institute_data.logo_url = path.join(path.dirname(INSTITUTE_PATH), "logo.png");
			} else {
				console.warn(`File '${LOGO_PATH}' does not exist`)
			}

			database_swap.push(institute_data);
		})

		this._database = database_swap;
		console.info(`Loaded ${this._database.length} institutes`)
		return false;
	}

	/** @returns {Array<Institute>} */
	getInstitutes() {
		return this._database;
	}

	/** 
	 * @param id {string}
	 * @returns {Institute | null} */
	searchInstituteByID(id) {
		console.log("Requested search of " + id);

		for (const institute of this._database) {
			console.table(institute)
			for (const sede of institute.sedi) {
				console.log(`\t Comparing ${id} with ${sede.codice_MIUR}`)
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

