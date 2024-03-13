import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Schedule from "../components/Schedule";
import { UserInfoContext } from "../context/UserInfoContext";
import axios from "axios";
import { BaseUrlContext } from "../context/BaseUrlContext";
import { useContext } from "react";

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
		week.push(new Date(curr));
		curr.setDate(curr.getDate() + 1);
	}
	console.log(week);
	return week;
}

const this_week_start = get_current_week_dates()[0];
const this_week_end = get_current_week_dates()[5];

export default function NewAppointment() {
	const {
		userToken,
		refreshUserScheduleForDisplayedWeek,
		updateUserSchedule,
		calculate_json_time_slots,
		calculate_time_slots,
		allUsers,
	} = useContext(UserInfoContext);

	const base_url = useContext(BaseUrlContext).baseUrl;

	const [user_time_slots, setUser_time_slots] = useState([]);
	const [json_time_slots, setJson_time_slots] = useState([]);
	const [selectedUserDetails, setSelectedUserDetails] = useState(null);
	const [selectedUserSchedule, setSelectedUserSchedule] = useState({
		taken_appointments: [],
		given_appointments: [],
	});
	const [currentWeek, setCurrentWeek] = useState({
		start_date: this_week_start,
		end_date: this_week_end,
	});

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

	const change_status = (appointment, status) => {
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
	};

	const getUserDetails = (firebase_id) => {
		const user = allUsers.find((user) => user.firebase_id === firebase_id);
		setSelectedUserDetails(user);
	};

	const getUserSchedule = (firebase_id) => {
		axios
			.post(
				`${base_url}/get-user-appointment`,
				{
					date: {
						start_date: currentWeek.start_date,
						end_date: currentWeek.end_date,
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
					taken_appointments: response.data.taken_appointments,
					given_appointments: response.data.given_appointments,
				};
				setSelectedUserSchedule(userSchedule);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleUserSelected = (firebase_id) => {
		const user_details = allUsers.find((user) => user.firebase_id === firebase_id);
		console.log("user details", user_details)
		setSelectedUserDetails(user_details);
		getUserDetails(user_details.firebase_id);
		getUserSchedule(user_details.firebase_id);
	};

	useEffect(() => {
		if (selectedUserDetails) {
			const user_time_slots = calculate_time_slots(
				selectedUserDetails.single_appointment_start_time,
				selectedUserDetails.single_appointment_end_time,
				selectedUserDetails.single_appointment_duration,
				selectedUserDetails.break_between_appointments
			);
			setUser_time_slots(user_time_slots);
			const json_time_slots = calculate_json_time_slots(
				selectedUserDetails.single_appointment_start_time,
				selectedUserDetails.single_appointment_end_time,
				selectedUserDetails.single_appointment_duration,
				selectedUserDetails.break_between_appointments
			);
			setJson_time_slots(json_time_slots);
		}
	}, [selectedUserDetails]);

	return (
		<div className="pt-24">
			<div>
				<div>
					<h1 className="text-3xl font-semibold text-center mt-4 text-blue-800">
						Book New Appointment
					</h1>
				</div>
			</div>
			<div>
				<div>
					<h1 className="text-2xl font-semibold text-center mt-4 text-blue-800">
						Select Faculty to Book Appointment With
					</h1>
				</div>
				<div>
					<select
						onChange={(e) => handleUserSelected(e.target.value)}
						className="block w-1/2 mx-auto my-4 mt-4 p-2 rounded-md border border-gray-300"
					>
						<option value="">Select Faculty</option>
						{allUsers.map((user) => (
							<option key={user.firebase_id} value={user.firebase_id}>
								<div className="flex flex-row justify-between h-14">
									<img
										src={user.profile_pic_url}
										alt="user"
										className="w-10 h-10 rounded-full"
									/>
									<div>
										{user.full_name}
									</div>
								</div>
							</option>
						))}
					</select>
				</div>
			</div>
			{selectedUserDetails && (
				<Schedule
					userSchedule={selectedUserSchedule}
					currentWeek={currentWeek}
					handleNextWeekChanged={handleNextWeekChanged}
					handlePreviousWeekChanged={handlePreviousWeekChanged}
					change_status={change_status}
					user_time_slots={user_time_slots}
					json_time_slots={json_time_slots}
				/>
			)}
		</div>
	);
}
