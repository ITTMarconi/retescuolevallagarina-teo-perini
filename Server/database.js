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

modules.exports = class Database {
	/** @type {Array<Institute>} */
	_database = [];

	Database() {
		/** @type {string} */
		let data_path = "../Data";
		if(this.fetchFromDisk(data_path)) {
			console.log(`Error fetching from disk at ${data_path}, exiting...`)
			exit(1)
		}
	}

	/** @returns {boolean} - returns true if an error occurred */
	fetchFromDisk(data_path) {
		/** @type {Array<Institute>} */
		let database_swap = [];

		/** @type {Array<string>} */
		let ISTITUTE_DIR;

		/** @type {string} */
		const ISTITUTES_PATH = path.join(data_path, "Istituti");

		try {
			ISTITUTE_DIR = fs.readdirSync(ISTITUTES_PATH);
		} catch (error) {
			console.error(`Could not read '${ISTITUTES_PATH}' directory\n${error}`);
			return true;
		}

		//@ts-ignore
		ISTITUTE_DIR.forEach(institute_id => {
			/** @type {Buffer} */
			let institute_data_raw;
			/** @type {Institute} */
			let institute_data;

			const INSTITUTE_PATH = path.join(ISTITUTES_PATH, institute_id)

			try {
				institute_data_raw = fs.readFileSync(INSTITUTE_PATH)
			} catch (error) {
				console.error(`Could not read '${INSTITUTE_PATH}' file\n${error}`);
				return true;
			}

			try {
				institute_data = JSON.parse(institute_data_raw.toString());
			} catch (error) {
				console.error(`Could not parse '${institute_id}' file\n${error}`);
				return true;
			}

			database_swap.push(institute_data);
		})

		this._database = database_swap;
		return false;
	}

	/** @returns {Array<Institute>} */
	getInstitutes() {
		return this._database;
	}

	// 	getSchool(id)
	// 	getInstitute(id)

	// 	searchSchool(name)
	// 	searchInstitute(name)
}

