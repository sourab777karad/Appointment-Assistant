/**
 * @file AssistantDAO.js
 * @description This file contains the AssistantDAO class which is responsible for interacting with the database to perform CRUD operations related to users and appointments.
 * @module AssistantDAO
 */

/**
 * @class AssistantDAO
 * @classdesc Represents the AssistantDAO class.
 */

// import AWS from 'aws-sdk';
// import config from '../config/config.js'

// variable to hold db connection
let cluster0;
export default class AssistantDAO {
	// Method to inject the database connection
	/**
	 * @method InjectDB
	 * @description Injects the database connection into the AssistantDAO class.
	 * @param {Object} conn - The database connection object.
	 * @returns {Promise<void>} - A promise that resolves when the database connection is injected.
	 */
	static async InjectDB(conn) {
		// If the connection is already established, return
		if (cluster0) {
			return;
		}
		try {
			// Establish a connection to the database
			cluster0 = await conn.db("Appointment-Assistant");
		} catch (e) {
			// Log any errors that occur during connection
			console.error(
				`Unable to establish a collection handle in LuxuriantDAO: ${e}`
			);
		}
	}

	/**
	 * @method newUser
	 * @description Creates a new user in the database.
	 * @param {string} email - The email of the user.
	 * @param {string} name - The name of the user.
	 * @param {string} room_address - The room address of the user.
	 * @returns {Promise<Object>} - A promise that resolves with the result of the user creation.
	 */
	//method to create new user
	static async newUser(email, name, room_address) {
		const user = {
			email,
			name,
			room_address,
		};

		try {
			const result = await cluster0.collection("users").insertOne(user);
			return result;
		} catch (e) {
			console.error(`Unable to create new user: ${e}`);
			return { error: e };
		}
	}

	/**
	 * @method SetAppointment
	 * @description Sets an appointment in the database.
	 * @param {string} appointee - The email of the appointee.
	 * @param {string} appointer - The email of the appointer.
	 * @param {Date} creation_time - The creation time of the appointment.
	 * @param {Date} appointment_time - The time of the appointment.
	 * @param {number} appointment_duration - The duration of the appointment in minutes.
	 * @param {string} appointment_purpose - The purpose of the appointment.
	 * @param {string} appointment_description - The description of the appointment.
	 * @returns {Promise<Object>} - A promise that resolves with the created or updated appointment.
	 */
	//method to setappointment
	static async SetAppointment(appointment) {
		let result;
		try {
			result = await cluster0.collection("appointments").insertOne(appointment);
			appointment._id = result.insertedId; // Get the id of the inserted document
		} catch (e) {
			console.error(`Unable to set appointment: ${e}`);
			throw e;
		}
		return appointment; // Return the complete appointment object
	}

	static async getAppointment(appointerid) {
		try {
			if (!appointerid) {
				console.log("Invalid apointer ID");
				return { message: "Invalid apointer ID" };
			}
	
			console.log('Attempting to retrieve appointments with apointer ID:', appointerid);
	
			const appointments = await cluster0.collection("appointments").find({ appointer: appointerid }).toArray();
			console.log('Appointments retrieved:', appointments);
			if (!appointments || appointments.length === 0) {
				console.log("No appointments found for the given apointer ID");
				return { message: "No appointments found for the given apointer ID" };
			}

	
			console.log('Appointments retrieved:', appointments);
			return appointments;
		} catch (e) {
			console.error(`Unable to get appointments: ${e}`);
			throw e;
		}
	}
	
}
