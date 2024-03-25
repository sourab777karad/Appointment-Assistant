import { ObjectId } from "mongodb";

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

	// Define a static asynchronous method to inject a database connection
	static async InjectDB(conn) {
		// If the connection is already established, return
		if (cluster0) {
			return;
		}
		try {
			// Establish a connection to the database
			// The connection object (conn) is expected to be a MongoDB client
			cluster0 = await conn.db("Appointment-Assistant");
		} catch (e) {
			// Log any errors that occur during connection
			console.error(`Unable to establish a collection handle in Appointment-Assistant: ${e}`);
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
	static async add_new_user(user) {
		// user will be getting from
		try {
			// check user exist before adding
			const userExist = await this.userExist(user.email);
			if (userExist) {
				console.log("User already exist");
				return false;
			}
			// append the user details to the user object
			user.single_appointment_duration = 15;
			user.single_appointment_start_time = 9;
			user.single_appointment_end_time = 17;
			user.break_between_appointments = 5;
			user.student_meeting_start_time = 16;
			user.student_meeting_end_time = 17;
			user.blocked_appointments = [];
			user.taken_appointments = [];
			user.given_appointments = [];

			// Insert the user into the 'users' collection
			await cluster0.collection("users").insertOne(user);
			// If the user document is successfully inserted, return true
			return true;
		} catch (e) {
			console.error(`Unable to create new user: ${e}`);
			return { error: e };
		}
	}

	// function to check user exist in the database
	static async userExist(email) {
		try {
			// Attempt to find a user document in the "users" collection
			// The user document to find is identified by the email field matching the provided email
			const user = await cluster0.collection("users").findOne({ email: email });
			// If no user is found, log a message and return false
			if (!user) {
				console.log("User not found");
				return false;
			}
			// If a user is found, return true
			return true;
		} catch (e) {
			console.error(`Unable to check user existence: ${e}`);
			throw e;
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
	static async SetAppointment(appointment_details) {
		try {
			// add attribute cancellation_message to the appointment_details object
			appointment_details.cancellation_message = "";
			// add attribute status to the appointment_details object
			appointment_details.status = "pending";
			// Insert the appointment_details into the 'appointments' collection
			const result = await cluster0.collection("appointments").insertOne(appointment_details);
			appointment_details._id = result.insertedId; // Get the id of the inserted document
			return appointment_details; // Return the complete appointment object
		} catch (e) {
			console.error(`Unable to set appointment: ${e}`);
			throw e;
		}
	}

	// Fucntion that is asynchronous that checks if a users's details are filled in the database
	static async areUserDetailsFilled(firebaseID) {
		try {
			// Query the "users" collection in the database for a user with the provided firebaseID
			const user = await cluster0.collection("users").findOne({ firebase_id: firebaseID });
			// If no user is found with the provided firebaseID, log a message and return an object with a status of false
			if (!user) {
				console.log("User not found");
				return { message: "User not found", status: false };
			}
			// If the found user does not have a phone number and room, log a message and return an object with the user's details and a status of false
			if (!user.phone_number && !user.room) {
				console.log("User details not filled");
				return { userDetails: user, status: false };
			}
			// If the user has both a phone number and room, return an object with the user's details and a status of true
			return { userDetails: user, status: true };
		} catch (e) {
			// If an error occurs, log the error and re-throw it
			console.error(`Unable to check user details: ${e}`);
			throw e;
		}
	}

	// update user details a Static asynchronous method to update user details
	static async updateUserDetails(user) {
		try {
			// Attempt to update a user document in the "users" collection
			// The user document to update is identified by the email field matching the email of the provided user object
			// The fields to update in the user document are specified in the $set operator
			const result = await cluster0.collection("users").updateOne(
				{ email: user.email },
				{
					$set: {
						phone_no: user.phone_no, // Update the phone_no field
						room_address: user.room_address, // Update the room_address field
						single_appointment_duration: user.single_appointment_duration, // Update the single_appointment_duration field
						single_appointment_start_time: user.single_appointment_start_time, // Update the single_appointment_start_time field
						single_appointment_end_time: user.single_appointment_end_time, // Update the single_appointment_end_time field
						break_between_appointments: user.break_between_appointments, // Update the break_between_appointments field
						student_meeting_start_time: user.student_meeting_start_time, // Update the student_meeting_start_time field
						student_meeting_end_time: user.student_meeting_end_time, // Update the student_meeting_end_time field
					},
				}
			);
			// Return the result of the update operation
			return result;
		} catch (e) {
			// If an error occurs, log the error and re-throw it
			console.error(`Unable to update user details: ${e}`);
			throw e;
		}
	}

	// Define a static asynchronous method to get all appointments
	static async getAppointment(firebase_ID, datetime) {
		try {
			// get all appointments from the appointments collection where scheduler_id or appointee_id is equal to the firebase_ID and the appointment in range of the given date and also sort them into taken appointments and given appointments
			// Attempt to find all appointments in the "appointments" collection
			// The appointments to find are those where either the scheduler_id or appointee_id matches the provided firebase_ID
			// and the appointment_date is greater than or equal to the start_date of the provided datetime object
			const appointments = await cluster0
				.collection("appointments")
				.find({
					$or: [{ scheduler_id: firebase_ID }, { appointee_id: firebase_ID }], // Condition to match either scheduler_id or appointee_id
					appointment_date: {
						$gte: datetime.date.start_date, // Condition to match appointment_date greater than or equal to start_date
					},
				})
				.toArray(); // Convert the result to an array
			// Return the found appointments
			return appointments;
		} catch (e) {
			// If an error occurs, log the error and re-throw it
			console.error(`Unable to get appointments: ${e}`);
			throw e;
		}
	}

	// method to get appointment by id
	static async getAppointmentById(appointmentId) {
		try {
			// Attempt to find an appointment in the "appointments" collection
			// The appointment to find is identified by the _id field matching the provided appointmentId
			// The ObjectId function is used to convert the appointmentId to an ObjectId, as MongoDB uses ObjectIds for the _id field
			const appointment = await cluster0
				.collection("appointments")
				.findOne({ _id: new ObjectId(appointmentId) });
			// If no appointment is found (i.e., appointment is null), log a message and return an object with a message field set to "Appointment not found"
			if (!appointment) {
				console.log("Appointment not found");
				return { message: "Appointment not found" };
			}
			// If an appointment is found, return the appointment document
			return appointment;
		} catch (e) {
			console.error(`Unable to get appointment: ${e}`);
			throw e;
		}
	}

	// Define a static asynchronous method to get all users
	static async getUsers() {
		try {
			// Attempt to find all user documents in the "users" collection
			// The find method without any arguments returns all documents in the collection
			// The toArray method is used to convert the result to an array
			const users = await cluster0.collection("users").find().toArray();
			// Return the array of user documents
			return users;
		} catch (e) {
			// If an error occurs, log the error and re-throw it
			console.error(`Unable to get users: ${e}`);
			throw e;
		}
	}

	// Define a static asynchronous method to get a user's profile
	static async getProfile(userId) {
		try {
			// Attempt to find a user document in the "users" collection
			// The user document to find is identified by the firebase_id field matching the provided userId
			const user_Profile = await cluster0
				.collection("users")
				.findOne({ firebase_id: userId });
			// If no user is found (i.e., user_Profile is null), log a message and return an object with a message field set to "User not found"
			if (!user_Profile) {
				console.log("User not found");
				return { message: "User not found" };
			}
			// If a user is found, return the user document
			return user_Profile;
		} catch (e) {
			console.error(`Unable to get profile stats: ${e}`);
			throw e;
		}
	}

	// Define a static asynchronous method to delete an appointment
	static async deleteAppointment(appointmentId) {
		try {
			// Attempt to delete an appointment in the "appointments" collection
			// The appointment to delete is identified by the _id field matching the provided appointmentId
			// The ObjectId function is used to convert the appointmentId to an ObjectId, as MongoDB uses ObjectIds for the _id field
			const result = await cluster0
				.collection("appointments")
				.deleteOne({ _id: new ObjectId(appointmentId) });

			// Log the number of deleted documents
			console.log(`Deleted count: ${result.deletedCount}`); // Log the number of deleted documents

			// If no appointment is deleted (i.e., deletedCount is 0), log a message and return an object with a message field set to "No appointment found with the given ID"
			if (result.deletedCount === 0) {
				console.log("No appointment found with the given ID");
				return { message: "No appointment found with the given ID" };
			}

			// If an appointment is deleted, return an object with a message field set to "Appointment deleted successfully"
			return { message: "Appointment deleted successfully" };
		} catch (e) {
			console.error(`Unable to delete appointment: ${e}`);
			throw e;
		}
	}

	// Define a static asynchronous method to change the status of an appointment
	static async changeStatus(status_details) {
		// Check if the appointment_id in the status_details object is a valid ObjectId
		// If it's not, log a message and return an object with a message field set to "Invalid ID"
		if (!ObjectId.isValid(status_details.appointment_id)) {
			console.log(`Invalid ID: ${status_details.appointment_id}`);
			return { message: "Invalid ID" };
		}

		try {
			// Attempt to update an appointment in the "appointments" collection
			// The appointment to update is identified by the _id field matching the appointment_id in the status_details object
			// The status field of the appointment is set to the status in the status_details object
			const result = await cluster0.collection("appointments").updateOne(
				{ _id: new ObjectId(status_details.appointment_id) },
				{
					$set: {
						status: status_details.status,
						scheduler_status_notif_pending:
							status_details.scheduler_status_notif_pending,
						appointee_status_notif_pending:
							status_details.appointee_status_notif_pending,
					},
				}
			);
			// If no appointment is updated (i.e., matchedCount is 0), log a message and return an object with a message field set to "No appointment found with the given ID"
			if (result.matchedCount === 0) {
				console.log("No appointment found with the given ID");
				return { message: "No appointment found with the given ID" };
			}
			// If an appointment is updated, return the result of the update operation
			return result;
		} catch (e) {
			console.error(`Unable to change status: ${e}`);
			throw e;
		}
	}

	// method to upload profile photo url to mongodb
	static async uploadProfilePhoto(userId, imageUri) {
		try {
			// Attempt to update a user document in the "users" collection
			// The user document to update is identified by the firebase_id field matching the provided userId
			// The profile_pic_url field of the user document is set to the provided imageUri
			const result = await cluster0
				.collection("users")
				.updateOne({ firebase_id: userId }, { $set: { profile_pic_url: imageUri } });
			// Return the result of the update operation
			return result;
		} catch (err) {
			// If an error occurs, log the error and re-throw it
			console.error(`Unable to upload profile photo: ${err}`);
			throw err;
		}
	}

	// Define a static asynchronous method to update a user's profile
	static async updateUserProfile(user_updated_details, firebaseID) {
		try {
			// Prepare an update object with only the fields that are not empty
			// Iterate over the entries of the user_updated_details object
			// If a value is not empty and the key is not "_id", add the key-value pair to the update object
			const update = {};
			for (const [key, value] of Object.entries(user_updated_details)) {
				if (value && key !== "_id") {
					update[key] = value;
				}
			}

			// Update user details in the users collection based on the firebaseID
			const result = await cluster0
				.collection("users")
				.updateOne({ firebase_id: firebaseID }, { $set: update });

			// If no user is updated (i.e., matchedCount is 0), log a message and return null
			if (result.matchedCount === 0) {
				console.log(`No user found with FirebaseID: ${firebaseID}`);
				return null;
			}

			// If a user is updated, log a message and return the result of the update operation
			console.log(`Updated user with FirebaseID: ${firebaseID}`);
			return result;
		} catch (e) {
			console.error(`Unable to update user profile: ${e}`);
			throw e;
		}
	}

	// method to add appointment to user
	static async add_appointment_to_user(schedulerId, appointeeId, appointmentId) {
		try {
			// Add the appointment ID if the user is the scheduler to the 'taken_appointments' array and add the appointment ID if the user is the appointee to the 'given_appointments' array
			// The user document to update is identified by the firebase_id field matching the provided schedulerId
			// The appointmentId is added to the 'taken_appointments' array of the user document
			await cluster0
				.collection("users")
				.updateOne(
					{ firebase_id: schedulerId },
					{ $push: { taken_appointments: appointmentId } }
				);
			await cluster0
				.collection("users")
				.updateOne(
					{ firebase_id: appointeeId },
					{ $push: { given_appointments: appointmentId } }
				);
			// If the updates are successful, return true
			return true;
		} catch (err) {
			console.error(`Unable to add appointment to user: ${err}`);
			return false;
		}
	}

	// method to get pending and cancelled appointments from the given FirebaseID
	static async getPendingCancelledAppointments(firebaseID) {
		try {
			// Attempt to find appointments in the "appointments" collection
			// The appointments to find are those where the scheduler_id or appointee_id field matches the provided firebaseID
			// and the status field is either "pending" or "cancelled"
			// Convert the result to an array
			const appointments = await cluster0
				.collection("appointments")
				.find({
					$or: [{ scheduler_id: firebaseID }, { appointee_id: firebaseID }],
					status: { $in: ["pending", "cancelled"] },
				})
				.toArray();
			// Return the array of appointments
			return appointments;
		} catch (e) {
			// If an error occurs, log the error and re-throw it
			console.error(`Unable to get pending/cancelled appointments: ${e}`);
			throw e;
		}
	}

	// method to update blocked appointments
	static async updateBlockedAppointments(firebaseID, blockedAppointments) {
		try {
			// blockedAppointments are array of objects that i have to insert in to users collection
			// Only keep start_time and appointment_date attributes
			// Attempt to update a user document in the "users" collection
			// The user document to update is identified by the firebase_id field matching the provided firebaseID
			// The blockedAppointments are added to the 'blocked_appointments' array of the user document
			const result = await cluster0
				.collection("users")
				.updateOne(
					{ firebase_id: firebaseID },
					{ $push: { blocked_appointments: { $each: blockedAppointments } } }
				);
			// Return the result of the update operation
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	// method to get blocked appointments
	static async getBlockedAppointments(firebaseID) {
		try {
			// Attempt to find a user document in the "users" collection
			// The user document to find is identified by the firebase_id field matching the provided firebaseID
			const user = await cluster0.collection("users").findOne({ firebase_id: firebaseID });

			// If no user is found, log a message and return an object with a message
			if (!user) {
				console.log("User not found");
				return { message: "User not found" };
			}

			// If a user is found, return the 'blocked_appointments' array of the user document
			return user.blocked_appointments;
		} catch (err) {
			console.error(`Unable to get blocked appointments: ${err}`);
			throw err;
		}
	}

	// method to unblock appointment slot
	static async unblockAppointment(firebaseID, appointment_details) {
		try {
			// Get the "users" collection
			const collection = cluster0.collection("users");
			// Iterate over the blocked_appointments in the appointment_details
			for (const appointment of appointment_details.blocked_appointments) {
				// Log the appointment details
				console.log("appointment_details inside unblock appointments", appointment);
				// Attempt to update a user document in the "users" collection
				// The user document to update is identified by the firebase_id field matching the provided firebaseID
				// The appointment is removed from the 'blocked_appointments' array of the user document
				await collection.updateOne(
					{ firebase_id: firebaseID },
					{
						$pull: {
							blocked_appointments: appointment,
						},
					}
				);
			}
			// If the updates are successful, return true
			return true;
		} catch (err) {
			console.error(`Unable to unblock appointment: ${err}`);
			return false;
		}
	}

	// method to delete user
	static async deleteUser(firebaseID) {
		try {
			// just put deleted user in front of the user name
			// Attempt to find a user document in the "users" collection
			// The user document to find is identified by the firebase_id field matching the provided firebaseID
			const user = await cluster0.collection("users").findOne({ firebase_id: firebaseID });

			// If no user is found, log a message and return an object with a message
			if (!user) {
				console.log("User not found");
				return { message: "User not found" };
			}
			// If a user is found, prepend "deleted user" to the user's name and email
			user.full_name = `deleted user ${user.name}`;
			user.email = `deleted user ${user.email}`;

			// Update the user details in the users collection
			const result = await cluster0
				.collection("users")
				.updateOne({ firebase_id: firebaseID }, { $set: user });

			// Return the result of the update operation
			return result;
		} catch (err) {
			console.error(`Unable to delete user: ${err}`);
			throw err;
		}
	}

	// method to update appointment
	static async updateAppointment(appointment_details) {
		// get the id field
		const id = appointment_details._id;
		// delete the id field
		delete appointment_details._id;
		// convert the id to ObjectId
		appointment_details._id = new ObjectId(id);
		try {
			// Attempt to update an appointment document in the "appointments" collection
			// The appointment document to update is identified by the _id field matching the ObjectId of the _id in the appointment_details
			// The appointment_details are used to update the appointment document
			return cluster0
				.collection("appointments")
				.updateOne(
					{ _id: new ObjectId(appointment_details._id) },
					{
						$set: appointment_details,
					}
				)
				.then((result) => {
					// If no appointment document was updated, log a message and return false
					if (result.matchedCount === 0) {
						console.log(`No appointment found with ID: ${appointment_details._id}`);
						return false;
					} else {
						// If an appointment document was updated, log a message and return true
						console.log(`Updated appointment with ID: ${appointment_details._id}`);
						return true;
					}
				});
		} catch (err) {
			console.error(`Unable to update appointment: ${err}`);
			throw err;
		}
	}
}
