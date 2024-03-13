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
		refreshUserScheduleForDisplayedWeek,
		userDetails,
		updateUserSchedule,
		currentWeek,
		setCurrentWeek,
		calculate_json_time_slots,
		calculate_time_slots,
	} = useContext(UserInfoContext);
	const base_url = useContext(BaseUrlContext).baseUrl;
	const user_time_slots = calculate_time_slots(
		userDetails.single_appointment_start_time,
		userDetails.single_appointment_end_time,
		userDetails.single_appointment_duration,
		userDetails.break_between_appointments
	);

	const json_time_slots = calculate_json_time_slots(
		userDetails.single_appointment_start_time,
		userDetails.single_appointment_end_time,
		userDetails.single_appointment_duration,
		userDetails.break_between_appointments
	);

	useEffect(() => {
		console.log("current week in user schedule", currentWeek);
	}, [currentWeek]);

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
			.then((response) => {
				console.log(response.data);
				refreshUserScheduleForDisplayedWeek();
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
		updateUserSchedule(nextWeek.start_date, nextWeek.end_date, userDetails.firebase_id);
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
		updateUserSchedule(previousWeek.start_date, previousWeek.end_date, userDetails.firebase_id);
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
				userSchedule={userSchedule}
				currentWeek={currentWeek}
				handleNextWeekChanged={handleNextWeekChanged}
				handlePreviousWeekChanged={handlePreviousWeekChanged}
				change_status={change_status}
				user_time_slots={user_time_slots}
				json_time_slots={json_time_slots}
			/>
		</div>
	);
};

export default UserSchedule;
