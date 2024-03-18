import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../context/UserInfoContext";
import Schedule from "../components/Schedule";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BaseUrlContext } from "../context/BaseUrlContext";

const UserSchedule = () => {
	const {
		userSchedule,
		userToken,
		refreshLoggedInUserScheduleForDisplayedWeek,
		userDetails,
		currentWeek,
		setCurrentWeek,
		calculate_json_time_slots,
		calculate_time_slots,
	} = useContext(UserInfoContext);
	const base_url = useContext(BaseUrlContext).baseUrl;

	const [user_time_slots, setUser_time_slots] = useState([]);
	const [json_time_slots, setJson_time_slots] = useState([]);

	useEffect(() => {
		// update user schedule for the current week
		refreshLoggedInUserScheduleForDisplayedWeek();
	}, []);

	useEffect(() => {
		if (userDetails === null) {
			return;
		}
		const user_time_slots = calculate_time_slots(
			userDetails.single_appointment_start_time,
			userDetails.single_appointment_end_time,
			userDetails.single_appointment_duration,
			userDetails.break_between_appointments
		);
		setUser_time_slots(user_time_slots);

		const json_time_slots = calculate_json_time_slots(
			userDetails.single_appointment_start_time,
			userDetails.single_appointment_end_time,
			userDetails.single_appointment_duration,
			userDetails.break_between_appointments
		);
		setJson_time_slots(json_time_slots);
	}, [currentWeek, userDetails]);

	function change_status(appointment, status) {
		const response = axios
			.post(
				`${base_url}/change-status`,
				{ status: status, appointment_id: appointment._id },
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			)
			.then(() => {
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

	function block_appointment(appointment_details_list) {
		// check if appointment_details_list is an array or not
		if (!Array.isArray(appointment_details_list)) {
			appointment_details_list = [appointment_details_list];
		}

		const response = axios
			.post(
				`${base_url}/update-blocked-appointments`,
				{
					blocked_appointments: appointment_details_list,
					firebase_id: userDetails.firebase_id,
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			)
			.then((response) => {
				refreshLoggedInUserScheduleForDisplayedWeek();
			})
			.catch((error) => {
				console.log(error);
			});

		toast.promise(response, {
			loading: "Loading",
			success: "Time slot blocked successfully",
			error: "Error blocking time slot",
		});
	}

	function unblock_appointment(appointment_details_list) {
		if (!Array.isArray(appointment_details_list)) {
			appointment_details_list = [appointment_details_list];
		}

		const response = axios
			.post(
				`${base_url}/unblock-appointment`,
				{
					blocked_appointments: appointment_details_list,
					firebase_id: userDetails.firebase_id,
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			)
			.then(() => {
				refreshLoggedInUserScheduleForDisplayedWeek();
			})
			.catch((error) => {
				console.log(error);
			});

		toast.promise(response, {
			loading: "Loading",
			success: "Time slot Unblocked successfully",
			error: "Error unblocking time slot",
		});
	}

	const handleNextWeekChanged = () => {
		// this function will change the currentWeek to the next week
		const nextWeek = {
			start_date: new Date(currentWeek.start_date).setDate(
				new Date(currentWeek.start_date).getDate() + 7
			),
			end_date: new Date(currentWeek.end_date).setDate(
				new Date(currentWeek.end_date).getDate() + 7
			),
		};
		setCurrentWeek(nextWeek);
		// now update the userSchedule
		refreshLoggedInUserScheduleForDisplayedWeek();
	};

	const handlePreviousWeekChanged = () => {
		// this function will change the currentWeek to the previous week
		const previousWeek = {
			start_date: new Date(currentWeek.start_date).setDate(
				new Date(currentWeek.start_date).getDate() - 7
			),
			end_date: new Date(currentWeek.end_date).setDate(
				new Date(currentWeek.end_date).getDate() - 7
			),
		};
		setCurrentWeek(previousWeek);
		// now update the userSchedule
		refreshLoggedInUserScheduleForDisplayedWeek();
	};

	return (
		<div className="pt-24">
			<div>
				<div>
					<h1 className="text-3xl font-semibold text-center mt-4 text-blue-800">
						User Schedule
					</h1>
				</div>
			</div>
			<Schedule
				user_id={userDetails.firebase_id}
				userSchedule={userSchedule}
				currentWeek={currentWeek}
				handleNextWeekChanged={handleNextWeekChanged}
				handlePreviousWeekChanged={handlePreviousWeekChanged}
				change_status={change_status}
				block_appointment={block_appointment}
				unblock_appointment={unblock_appointment}
				user_time_slots={user_time_slots}
				json_time_slots={json_time_slots}
			/>
		</div>
	);
};

export default UserSchedule;
