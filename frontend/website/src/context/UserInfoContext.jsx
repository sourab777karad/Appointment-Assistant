import { createContext, useState } from "react";

export const UserInfoContext = createContext();

export const UserInfoContextProvider = ({ children }) => {
	const [userToken, setUserToken] = useState(null);
	const [currentAppointment, setCurrentAppointment] = useState(null);
	const [userDetails, setUserDetails] = useState(null);
	const [userSchedule, setUserSchedule] = useState(null);
	const single_appointment_duration = 15;
	const single_appointment_start_time = 9;
	const single_appointment_end_time = 17;
	const break_between_appointments = 5;

	function calculate_time_slots() {
		const time_slots = [];
		for (let i = single_appointment_start_time; i < single_appointment_end_time; i++) {
			for (let j = 0; j < 60; j += single_appointment_duration) {
				const start_time = i + ":" + (j === 0 ? "00" : j) + (i < 12 ? " AM" : " PM");
				const end_time = i + ":" + (j + single_appointment_duration) + (i < 12 ? " AM" : " PM");
				const time = start_time + " - " + end_time;
				j += break_between_appointments;
				time_slots.push(time);
			}
		}
		return time_slots;
	}

	function calculate_json_time_slots() {
		// here time_slots is an array of objects
		// each object contains a start_time and an end_time
		// start_time and end_time are integers written in 24 hour format like 1020 or 1345
		const time_slots = [];
		for (let i = single_appointment_start_time; i < single_appointment_end_time; i++) {
			for (let j = 0; j < 60; j += single_appointment_duration) {
				const start_time = i * 100 + j;
				const end_time = i * 100 + j + single_appointment_duration;
				time_slots.push({ start_time: start_time, end_time: end_time });
				j += break_between_appointments;
			}
		}
		return time_slots;
	}

	const time_slots = calculate_time_slots();
	const json_time_slots = calculate_json_time_slots();
	return (
		<UserInfoContext.Provider
			value={{
				userToken: userToken,
				setUserToken: setUserToken,
				currentAppointment: currentAppointment,
				setCurrentAppointment: setCurrentAppointment,
				userDetails: userDetails,
				setUserDetails: setUserDetails,
				time_slots: time_slots,
				userSchedule: userSchedule,
				setUserSchedule: setUserSchedule,
				json_time_slots: json_time_slots,
			}}
		>
			{children}
		</UserInfoContext.Provider>
	);
};
