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
	static async SetAppointment(
		appointee,
		appointer,
		creation_time,
		appointment_time,
		appointment_duration,
		appointment_purpose,
		appointment_description
	) {
		// Check if the appointment already exists
		let appointment = await cluster0
			.collection("appointments")
			.findOne({ appointee, appointer });

		if (appointment) {
			console.log("The appointment already exists", appointment);

			// If the appointment exists and has different information, update it
			// if (
			//     appointment.creation_time !== creation_time ||
			//     appointment.appointment_time !== appointment_time ||
			//     appointment.appointment_duration !== appointment_duration ||
			//     appointment.appointment_purpose !== appointment_purpose ||
			//     appointment.appointment_description !== appointment_description
			// ) {
			//     const result = await cluster0
			//         .collection("appointments")
			//         .findOneAndUpdate(
			//             { appointee, appointer },
			//             {
			//                 $set: {
			//                     creation_time,
			//                     appointment_time,
			//                     appointment_duration,
			//                     appointment_purpose,
			//                     appointment_description
			//                 },
			//             },
			//             { returnOriginal: false }
			//         );
			//     appointment = result.value;
			// }
		} else {
			// If the appointment does not exist, add it to the database
			const result = await cluster0.collection("appointments").insertOne({
				appointee,
				appointer,
				creation_time,
				appointment_time,
				appointment_duration,
				appointment_purpose,
				appointment_description,
			});
			appointment = result;
		}

		return appointment;
	}
}
