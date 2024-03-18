import axios from "axios";
import { toast } from "react-hot-toast";
import { format, isValid, parse } from "date-fns";

export default class basic_functions {
	static get_people_from_appointment(appointment, allUsers) {
		if (appointment === null) {
			return null;
		}
		// iterate through the allUsers array to find the user with the given firebase_id as appointment.scheduler_id
		const scheduler = allUsers.find((user) => user.firebase_id === appointment.scheduler_id);
		const appointee = allUsers.find((user) => user.firebase_id === appointment.appointee_id);
		return {
			scheduler,
			appointee,
		};
	}

	static async change_status(
		appointment,
		status,
		base_url,
		userToken,
		refreshLoggedInUserScheduleForDisplayedWeek,
		allUsers,
		message
	) {
		/**
		 * This function changes the status of the appointment and sends a mail to the scheduler
		 * @param {Object} appointment - The appointment object
		 * @param {string} status - The new status of the appointment
		 * @param {string} base_url - The base URL for the API
		 * @param {string} userToken - The user's token
		 * @param {Function} refreshLoggedInUserScheduleForDisplayedWeek - Function to refresh the user's schedule
		 * @param {Array} allUsers - Array of all users
		 * @param {string} message - The message to be sent in the email
		 * @return {Promise} Returns a promise that resolves to the response of the axios post request
		 */
		const { scheduler, appointee } = await this.get_people_from_appointment(
			appointment,
			allUsers
		);
		const response = axios
			.post(
				`${base_url}/change-status`,
				{
					status: status,
					appointment_id: appointment._id,
					scheduler_email_id: scheduler.email,
					appointee_email_id: appointee.email,
					message: message,
					appointment_location: appointee.room,
					appointment_time: appointment.start_time,
					appiontment_duration: appointment.duration,
					appointee_name: appointee.full_name,
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			)
			.then((response) => {
				console.log(response.data);
				if (response.data.sendmail_status === true) {
					toast.success(`Mail sent to ${scheduler.email} successfully`);
				}
				if (response.data.sendmail_status === false) {
					toast.success(`Could not send confirmation mail to ${scheduler.email}`);
				}
				refreshLoggedInUserScheduleForDisplayedWeek();
			})
			.catch((error) => {
				console.log(error);
			});

		toast.promise(response, {
			loading: "Loading",
			success: "Status changed successfully",
			error: "Error changing status",
		});
	}

	static getAppointments(userSchedule, given_date) {
		/**
		 * This function returns the appointments for the given date
		 * @param {Object} userSchedule - The user's schedule
		 * @param {string} given_date - The date for which the appointments are to be fetched
		 * @return {Array} Returns an array of appointments for the given date
		 */
		const appointments = [];

		// for taken appointments
		for (let i = 0; i < userSchedule?.taken_appointments?.length; i++) {
			const appointmentDate = userSchedule.taken_appointments[i].appointment_date;
			const parsedGivenDate = parse(given_date, "yyyy-MM-dd", new Date());
			const parsedAppointmentDate = parse(appointmentDate, "yyyy-MM-dd", new Date());

			if (isValid(parsedGivenDate) && isValid(parsedAppointmentDate)) {
				const givenDateFormatted = format(parsedGivenDate, "yyyy-MM-dd");
				const appointmentDateFormatted = format(parsedAppointmentDate, "yyyy-MM-dd");

				if (appointmentDateFormatted === givenDateFormatted) {
					appointments.push(userSchedule.taken_appointments[i]);
				}
			}
		}

		// now same for given apppointments
		for (let i = 0; i < userSchedule?.given_appointments?.length; i++) {
			const appointmentDate = userSchedule.given_appointments[i].appointment_date;
			const parsedGivenDate = parse(given_date, "yyyy-MM-dd", new Date());
			const parsedAppointmentDate = parse(appointmentDate, "yyyy-MM-dd", new Date());

			if (isValid(parsedGivenDate) && isValid(parsedAppointmentDate)) {
				const givenDateFormatted = format(parsedGivenDate, "yyyy-MM-dd");
				const appointmentDateFormatted = format(parsedAppointmentDate, "yyyy-MM-dd");

				if (appointmentDateFormatted === givenDateFormatted) {
					appointments.push(userSchedule.given_appointments[i]);
				}
			}
		}

		return appointments;
	}
}
