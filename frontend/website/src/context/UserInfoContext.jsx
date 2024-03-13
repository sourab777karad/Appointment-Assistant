import { createContext, useEffect, useState } from "react";
import React from "react";
import { BaseUrlContext } from "./../context/BaseUrlContext";
import axios from "axios";
export const UserInfoContext = createContext();

function get_previous_monday_date() {
	// this gives you the date of the previous monday
	var d = new Date();
	var day = d.getDay();
	var diff = d.getDate() - day + (day == 0 ? -6 : 1);
	return new Date(d.setDate(diff));
}

function get_current_week_dates() {
	var curr = get_previous_monday_date(); // get current date
	var week = [];
	for (var i = 0; i < 6; i++) {
		week.push(curr);
		curr.setDate(curr.getDate() + 1);
	}
	return week;
}

export const UserInfoContextProvider = ({ children }) => {
	const base_url = React.useContext(BaseUrlContext).baseUrl;
	const [userToken, setUserToken] = useState(null);
	const [currentAppointment, setCurrentAppointment] = useState(null);
	const [userDetails, setUserDetails] = useState(null);
	const [currentWeek, setCurrentWeek] = useState({
		start_date: get_current_week_dates()[0],
		end_date: get_current_week_dates()[5],
	});
	const [userSchedule, setUserSchedule] = useState({
		taken_appointments: [],
		given_appointments: [],
	});
	const [allUsers, setAllUsers] = useState([]);
	const [notifsExist, setNotifsExist] = useState(false);

	function calculate_time_slots(
		single_appointment_start_time = 9,
		single_appointment_end_time = 17,
		single_appointment_duration = 30,
		break_between_appointments = 5
	) {
		const time_slots = [];
		for (let i = single_appointment_start_time; i < single_appointment_end_time; i++) {
			for (let j = 0; j < 60; j += single_appointment_duration) {
				const start_time = i + ":" + (j === 0 ? "00" : j) + (i < 12 ? " AM" : " PM");
				const end_time =
					i + ":" + (j + single_appointment_duration) + (i < 12 ? " AM" : " PM");
				const time = start_time + " - " + end_time;
				j += break_between_appointments;
				time_slots.push(time);
			}
		}
		return time_slots;
	}

	function calculate_json_time_slots(
		single_appointment_start_time = 9,
		single_appointment_end_time = 17,
		single_appointment_duration = 30,
		break_between_appointments = 5
	) {
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

	function calculate_notifs_exist() {
		const given_appointments = userSchedule.given_appointments;
		const notifs_exist = given_appointments.some(
			(appointment) => appointment.status === "pending" || appointment.status === "cancelled"
		);
		setNotifsExist(notifs_exist);
	}

	function refreshUserScheduleForDisplayedWeek() {
		// this function will refresh the userSchedule and allUsers
		// it will be called after every change in the userSchedule
		// it will be called after every change in the allUsers
		axios
			.post(
				`${base_url}/get-user-appointment`,
				{
					date: {
						start_date: currentWeek.start_date,
						end_date: currentWeek.end_date,
					},
					firebase_id: userDetails.firebase_id,
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			)
			.then((response) => {
				let userSchedule = {
					taken_appointments: response.data.taken_appointments,
					given_appointments: response.data.given_appointments,
				};
				setUserSchedule(userSchedule);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function refreshProfile() {
		axios
			.get(`${base_url}/get-profile`, {
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			})
			.then((response) => {
				setUserDetails(response.data.profile_data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function updateUserSchedule(start_date, end_date, firebase_id) {
		// this function does the same thing as refresh user schedule for a given time and date, except it will add the taken and given appointments to the already existing userschedule taken and given appointments list.
		axios
			.post(
				`${base_url}/get-user-appointment`,
				{
					date: {
						start_date: start_date,
						end_date: end_date,
					},
					firebase_id: firebase_id,
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			)
			.then((response) => {
				let userSchedule = {
					taken_appointments: [
						...userSchedule.taken_appointments,
						...response.data.taken_appointments,
					],
					given_appointments: [
						...userSchedule.given_appointments,
						...response.data.given_appointments,
					],
				};
				setUserSchedule(userSchedule);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function refreshNotifications() {
		// this function will call all the pending and cancelled notifications of the logged in user will be fetched and updated in the user schedule.
		axios
			.post(
				`${base_url}/get-notifications`, // return all cancelled
				// and pending appointments of the user from tken
				{},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			)
			.then((response) => {
				let userSchedule = {
					taken_appointments: [
						...userSchedule.taken_appointments,
						...response.data.taken_appointments,
					],
					given_appointments: [
						...userSchedule.given_appointments,
						...response.data.given_appointments,
					],
				};
				setUserSchedule(userSchedule);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		calculate_notifs_exist();
	}, [userSchedule]);

	return (
		<UserInfoContext.Provider
			value={{
				userToken: userToken,
				setUserToken: setUserToken,
				currentAppointment: currentAppointment,
				setCurrentAppointment: setCurrentAppointment,
				userDetails: userDetails,
				setUserDetails: setUserDetails,
				userSchedule: userSchedule,
				setUserSchedule: setUserSchedule,
				allUsers: allUsers,
				setAllUsers: setAllUsers,
				notifsExist: notifsExist,
				setNotifsExist: setNotifsExist,
				refreshProfile: refreshProfile,
				refreshUserScheduleForDisplayedWeek: refreshUserScheduleForDisplayedWeek,
				updateUserSchedule: updateUserSchedule,
				currentWeek: currentWeek,
				setCurrentWeek: setCurrentWeek,
				refreshNotifications: refreshNotifications,
				calculate_json_time_slots: calculate_json_time_slots,
				calculate_time_slots: calculate_time_slots,
			}}
		>
			{children}
		</UserInfoContext.Provider>
	);
};
