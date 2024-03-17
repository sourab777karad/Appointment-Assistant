import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import DayDetailsTable from "../components/DayDetailsTable";
import { UserInfoContext } from "../context/UserInfoContext";
import { parse, format, isValid } from "date-fns";

export default function DayDetails() {
	const location = useLocation();
	console.log(location);
	const user_time_slots = location.state.user_time_slots;
	const json_time_slots = location.state.json_time_slots;
	const given_date = location.state.date;
	const given_day = location.state.day;
	const [appointments, setAppointments] = useState({});
	const { userSchedule } = useContext(UserInfoContext);

	function getAppointments() {
		const appointments = [];
		console.log(userSchedule, given_date);

		// for taken appointments
		for (let i = 0; i < userSchedule?.taken_appointments?.length; i++) {
			const appointmentDate = userSchedule.taken_appointments[i].appointment_date;
			const parsedGivenDate = parse(given_date, "yyyy-MM-dd", new Date());
			const parsedAppointmentDate = parse(appointmentDate, "yyyy-MM-dd", new Date());

			if (isValid(parsedGivenDate) && isValid(parsedAppointmentDate)) {
				const givenDateFormatted = format(parsedGivenDate, "yyyy-MM-dd");
				const appointmentDateFormatted = format(parsedAppointmentDate, "yyyy-MM-dd");

				console.log(appointmentDate);
				console.log(given_date);
				console.log("proper given", givenDateFormatted);
				console.log("proper app", appointmentDateFormatted);

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

				console.log(appointmentDate);
				console.log(given_date);
				console.log("proper given", givenDateFormatted);
				console.log("proper app", appointmentDateFormatted);

				if (appointmentDateFormatted === givenDateFormatted) {
					appointments.push(userSchedule.given_appointments[i]);
				}
			}
		}

		console.log(appointments);
		return appointments;
	}
	useEffect(() => {
		const appointments = getAppointments();
		setAppointments(appointments);
	}, []);

	return (
		<div className="pt-24 px-8">
			<div>
				<div>
					<h1 className="text-3xl font-semibold text-center mt-4 text-blue-800">
						Scheduled Appointments for {given_day}, {given_date}
					</h1>
				</div>
			</div>
			<DayDetailsTable
				json_time_slots={json_time_slots}
				user_time_slots={user_time_slots}
				appointments={appointments}
			/>
		</div>
	);
}
