import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import DayDetailsTable from "../components/DayDetailsTable";
import { UserInfoContext } from "../context/UserInfoContext";

export default function DayDetails() {
	const location = useLocation();
	console.log(location);
	const user_time_slots = location.state.user_time_slots;
	const json_time_slots = location.state.json_time_slots;
	const given_date = location.state.date;
	const given_day = location.state.day;
	const [appointments, setAppointments] = useState({});
	const { userDetails } = useContext(UserInfoContext);

	function getAppointments() {
		// iterate through the the given and taken appointments in userdetails to get appointments matching the given date
		const appointments = [];
		for (let i = 0; i < userDetails?.taken_appointments?.length; i++) {
			if (userDetails.taken_appointments[i].appointment_date === given_date) {
				appointments.push(userDetails.appointments[i]);
			}

			if (userDetails.given_appointments[i].appointment_date === given_date) {
				appointments.push(userDetails.appointments[i]);
			}
		}

		return [1, 2, 3];
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
