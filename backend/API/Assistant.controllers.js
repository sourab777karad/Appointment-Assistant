// import AssistantDAO from "../DAO/AssistantDAO";
import firebase from "firebase-admin";
import AssistantDAO from "../DAO/AssistantDAO.js";
import MailController from "../Services/Mail.service.js";
import { URL } from "url";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// class to handle all the assistant related operations
export default class AssistantController {
	// method to add new user
	static async addNewUser(req, res) {
		const user = req.body;

		try {
			// if the profile pic url has been injected or inserted from the frontend, well discard it.
			if (user.profile_pic_url !== null && user.profile_pic_url !== undefined) {
				// make it an empty string
				user.profile_pic_url = "";
			}

			// if the user's email includes only numbers, then we make a new attribtue called is_faculty, and set it to false.
			const emailLocalPart = user.email.split("@")[0];

			if (emailLocalPart.match(/^[0-9]+$/) !== null) {
				user.is_faculty = true;
			} else {
				user.is_faculty = true;
			}

			const status = await AssistantDAO.add_new_user(user);
			return res.status(200).json({ status: status });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error adding new user" });
		}
	}
	// method to check if the user details are filled or not
	static async areUserDetailsFilled(req, res) {
		try {
			const user = req.user_decoded_details;
			// only want user id from the token
			const firebaseID = user.user_id;
			const appointment_date = req.body;
			// console.log(appointment_date);
			const Status = await AssistantDAO.areUserDetailsFilled(firebaseID);
			if (Status.message === "User not found") {
				return res.status(200).json({ filled: false, newUser: true });
			}
			if (
				appointment_date.date.start_date === null &&
				appointment_date.date.end_date === null
			) {
				return res.status(400).json({ message: "Date range not provided" });
			}
			// console.log("Status:", Status);
			// blocked appointments date from users collection
			const blocked_appointments = Status.userDetails.blocked_appointments;

			// get appointments of the user with all the given and taken appointments
			const appointments = await AssistantDAO.getAppointment(user.user_id, appointment_date);

			// console.log("Appointments inside areUserDetailsFilled controller", appointments);
			// now sort appointments into taken and given appointments
			const taken_appointments = [];
			const given_appointments = [];
			for (let i = 0; i < appointments.length; i++) {
				if (appointments[i].scheduler_id === user.user_id) {
					taken_appointments.push(appointments[i]);
				} else {
					given_appointments.push(appointments[i]);
				}
			}
			// get all users from the users collection and return the name, firebase id, email, phone number, room.
			const users = await AssistantDAO.getUsers();
			// console.log(users);
			return res.status(200).json({
				filled: Status.status,
				userDetails: Status.userDetails,
				newUser: false,
				userSchedule: {
					taken_appointments,
					given_appointments,
					blocked_appointments,
				},
				users: users,
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error checking user details" });
		}
	}
	// update user details in the users collection
	static async updateUserDetails(req, res) {
		try {
			const user = req.body;
			const result = await AssistantDAO.updateUserDetails(user);
			return res.status(200).json(result);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error updating user details" });
		}
	}
	// method to get all the appointments of the user as scheduler and appointee
	static async get_user_Appointment(req, res) {
		try {
			const appointment_details = req.body;

			if (
				appointment_details.date.start_date === null &&
				appointment_details.date.end_date === null
			) {
				return res.status(400).json({ message: "Date range not provided" });
			}
			// console.log("appointment_details:", appointment_details);
			// get appointments of the user with all the given and taken appointments
			const appointments = await AssistantDAO.getAppointment(
				appointment_details.firebase_id,
				appointment_details
			);

			// console.log(appointments);
			// now sort appointments into taken and given appointments
			const taken_appointments = [];
			const given_appointments = [];
			for (let i = 0; i < appointments.length; i++) {
				if (appointments[i].scheduler_id === appointment_details.firebase_id) {
					taken_appointments.push(appointments[i]);
				} else {
					given_appointments.push(appointments[i]);
				}
			}
			// return blocked_appointments from users table for the given firebase id
			const blocked_appointments = await AssistantDAO.getBlockedAppointments(
				appointment_details.firebase_id
			);

			return res
				.status(200)
				.json({ taken_appointments, given_appointments, blocked_appointments });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error retrieving appointment" });
		}
	}
	// method to set appointment by the user
	static async setAppointment(req, res) {
		try {
			const schedularToken = req.user_decoded_details;
			const schedularId = schedularToken.user_id;
			const appointment_details = req.body;

			const appointment = await AssistantDAO.SetAppointment(appointment_details);
			// taken appointments and given appointments add appointment id to the user collection for if the user is scheduler insert the appointment id into the users taken appointment attribute array and if the user is the appointer insert the appointment id into the users given appointment attribute array.
			// schedular , appointee are the attributes in appointment_details

			// console.log(
			// 	"appointment_details in SetAppointment controller method",
			// 	appointment_details
			// );
			const appointeeId = appointment_details.appointee_id;

			const status = await AssistantDAO.add_appointment_to_user(
				schedularId,
				appointeeId,
				appointment._id
			);

			return res.status(200).json({ status });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error setting appointment" });
		}
	}
	// method to get all users from the users collection with the name, firebase id, email, phone number, room
	static async getUsers(req, res) {
		try {
			const users = await AssistantDAO.getUsers();
			res.status(200).json(users);
		} catch (e) {
			console.error(`Unable to get users: ${e}`);
			res.status(500).json({ message: `Unable to get users: ${e}` });
		}
	}
	// method to getProfile of the user by user id
	static async getProfileByUserId(req, res) {
		try {
			const user = req.user_decoded_details;
			const userId = user.user_id;

			const profile_data = await AssistantDAO.getProfile(userId);

			return res.status(200).json({ profile_data });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error retrieving profile" });
		}
	}
	// method to delete appointment
	static async deleteAppointment(req, res) {
		try {
			const appointmentId = req.body.appointmentId; // Get the appointment ID from the request parameters
			const result = await AssistantDAO.deleteAppointment(appointmentId);
			res.status(200).json(result);
		} catch (e) {
			console.error(`Unable to delete appointment: ${e}`);
			res.status(500).json({ message: `Unable to delete appointment: ${e}` });
		}
	}
	// method to change the status of the appointment (confirmed, rejected, pending)
	static async changeStatus(req, res) {
		try {
			const appointment_details = req.body; // Get the appointment ID from the request body

			// check for the schedular id in the appointment collection schedular attribute if they match then update the status of the appointment

			const result = await AssistantDAO.changeStatus(appointment_details);
			const mailController = new MailController();
			const sendmail_status = await mailController.sendMail(
				appointment_details.scheduler_email_id,
				appointment_details.status,
				appointment_details.message,
				appointment_details.appointee_name,
				appointment_details.appointment_time,
				appointment_details.appointment_date,
				appointment_details.appointment_duration,
				appointment_details.appointment_location,
				appointment_details.appointee_email_id
			);

			// return res.status(200).json({result, sendmail_status});
			return res.status(200).json({ sendmail_status });
		} catch (e) {
			console.error(`Unable to change status: ${e}`);
			res.status(500).json({ message: `Unable to change status: ${e}` });
		}
	}
	// method to update profile photo
	static async updateProfilePhoto(req, res) {
		try {
			const bucket = firebase.storage().bucket();
			const decodedToken = req.user_decoded_details;
			const userId = decodedToken.user_id;
			const image = req.file;
			// console.log(image);
			if (!image) {
				return res.status(400).json({ message: "No image uploaded" });
			}

			// first delete the old profile photo
			const user = await AssistantDAO.getProfile(userId);
			const oldProfilePhoto = user.profile_pic_url;
			// console.log("old profile photos", oldProfilePhoto);

			try {
				// if it exists.
				if (oldProfilePhoto && oldProfilePhoto.length > 0) {
					// parse the url
					const url = new URL(oldProfilePhoto);
					// get the filename
					let filePath = url.pathname.split("/");
					// get the last 2 elements of this array
					filePath = filePath.slice(-2).join("/");
					// console.log("file path", filePath);

					// delete this file
					await bucket.file("/" + filePath).delete();
				}
			} catch (err) {
				console.log("Errrrrrrrrrrror deleting old profile photo", err);
			}

			// upload the new profile photo
			let filename = req.file.originalname;

			// get the extension of the file
			let extension = path.extname(filename);

			// create a new filename
			let new_filename = uuidv4() + extension;

			let fileUpload = bucket.file("/profile-photos/" + new_filename);

			const blobStream = fileUpload.createWriteStream({
				metadata: {
					contentType: image.mimetype,
				},
			});

			blobStream.on("error", (error) => {
				console.error("Something is wrong! Unable to upload at the moment." + error);
				return res
					.status(500)
					.json({ message: "Error uploading file", error: error.message });
			});

			blobStream.on("finish", async () => {
				// The public URL can be used to directly access the file via HTTP.
				const file = bucket.file(`/profile-photos/${new_filename}`);
				const publicUrl = await file.getSignedUrl({
					action: "read",
					expires: "12-31-3000",
				});
				await AssistantDAO.uploadProfilePhoto(userId, publicUrl[0]);
				return res.status(200).send(publicUrl[0]);
			});
			blobStream.end(image.buffer);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error uploading profile photo" });
		}
	}
	// method to update user profile
	static async updateUserProfile(req, res) {
		try {
			const decodedToken = req.user_decoded_details;
			const firebase_userId = decodedToken.user_id;
			const user_updated_details = req.body;
			const result = await AssistantDAO.updateUserProfile(
				user_updated_details,
				firebase_userId
			);
			return res.status(200).json(result);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error updating user profile" });
		}
	}
	// method to get pending and cancelled appointments for that firebaseID
	static async getPendingCancelledAppointments(req, res) {
		try {
			const decodedToken = req.user_decoded_details;
			const firebase_userId = decodedToken.user_id;
			const appointments = await AssistantDAO.getPendingCancelledAppointments(
				firebase_userId
			);

			// sort them into taken and given appointments
			const taken_appointments = [];
			const given_appointments = [];
			for (let i = 0; i < appointments.length; i++) {
				if (appointments[i].scheduler_id === firebase_userId) {
					taken_appointments.push(appointments[i]);
				} else {
					given_appointments.push(appointments[i]);
				}
			}
			return res.status(200).json(taken_appointments, given_appointments);
		} catch (err) {
			console.error(err);
			return res
				.status(500)
				.json({ message: "Error getting pending and cancelled appointments" });
		}
	}

	// method to update blocked appointments
	static async updateBlockedAppointments(req, res) {
		try {
			const decodedToken = req.user_decoded_details;
			const firebase_userId = decodedToken.user_id;
			const blocked_appointments = req.body.blocked_appointments;
			const result = await AssistantDAO.updateBlockedAppointments(
				firebase_userId,
				blocked_appointments
			);
			return res.status(200).json(result);
		} catch (err) {
			console.error(err);
			return res.status(500);
		}
	}

	// method to update appointment
	static async updateAppointment(req, res) {
		try {
			const appointment_details = req.body;
			AssistantDAO.updateAppointment(appointment_details)
				.then((result) => {
					return res.status(200).json(result);
				})
				.catch((err) => {
					console.error(err);
					return res.status(500).json({ message: "Error updating appointment" });
				});
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error updating appointment" });
		}
	}
	// method to get faculty schedule
	static async getFacultySchedule(req, res) {
		try {
			const appointment_details = req.body;

			if (
				appointment_details.date.start_date === null &&
				appointment_details.date.end_date === null
			) {
				return res.status(400).json({ message: "Date range not provided" });
			}
			// console.log("appointment_details:", appointment_details);
			// get appointments of the user with all the given and taken appointments
			const appointments = await AssistantDAO.getAppointment(
				appointment_details.firebase_id,
				appointment_details
			);

			// console.log(appointments);
			// now sort appointments into taken and given appointments
			const taken_appointments = [];
			const given_appointments = [];
			for (let i = 0; i < appointments.length; i++) {
				if (appointments[i].scheduler_id === appointment_details.firebase_id) {
					taken_appointments.push(appointments[i]);
				} else {
					given_appointments.push(appointments[i]);
				}
			}
			// return blocked_appointments from users table for the given firebase id
			const blocked_appointments = await AssistantDAO.getBlockedAppointments(
				appointment_details.firebase_id
			);

			return res.status(200).json({
				taken_appointments: taken_appointments.map(
					({ appointment_date, appointment_time, duration, status }) => ({
						appointment_date,
						appointment_time,
						duration,
						status,
					})
				),
				given_appointments: given_appointments.map(
					({ appointment_date, appointment_time, duration, status }) => ({
						appointment_date,
						appointment_time,
						duration,
						status,
					})
				),
				blocked_appointments,
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error retrieving faculty schedule" });
		}
	}
	// method to unblock appointment
	static async unblockAppointment(req, res) {
		try {
			const decodedToken = req.user_decoded_details;
			const appointment_details = req.body;
			const result = await AssistantDAO.unblockAppointment(
				decodedToken.user_id,
				appointment_details
			);
			console.log("result", result);
			return res.status(200).json(result);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error unblocking appointment" });
		}
	}

	// method to delete user
	static async deleteUser(req, res) {
		try {
			const decodedToken = req.user_decoded_details;
			const firebase_userId = decodedToken.user_id;
			// also delete from firebase with there photos from firebase storage
			const bucket = firebase.storage().bucket();
			const user = await AssistantDAO.getProfile(firebase_userId);
			const oldProfilePhoto = user.profile_pic_url;
			// console.log("old profile photos", oldProfilePhoto);
			try {
				// if it exists.
				if (oldProfilePhoto && oldProfilePhoto.length > 0) {
					// parse the url
					const url = new URL(oldProfilePhoto);
					// get the filename
					let filePath = url.pathname.split("/");
					// get the last 2 elements of this array
					filePath = filePath.slice(-2).join("/");
					console.log("file path", filePath);

					// delete this file
					await bucket.file("/" + filePath).delete();
				}
			} catch (err) {
				console.log("Errrrrrrrrrrror deleting old profile photo", err);
			}

			// delete the firebase user
			await firebase.auth().deleteUser(firebase_userId);
			// delete the user from the users collection
			const result = await AssistantDAO.deleteUser(firebase_userId);
			return res.status(200).json(result);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Error deleting user" });
		}
	}
}
