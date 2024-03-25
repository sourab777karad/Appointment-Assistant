// React imports
import { useEffect, useState, useContext } from "react";

// Context imports
import { UserInfoContext } from "../context/UserInfoContext";
import { BaseUrlContext } from "../context/BaseUrlContext";

// utility imports
import basic_functions from "../utils/basic_functions";
import { parse, isPast } from "date-fns";

// Asset imports
import NoAppsvg from "../assets/no_appointments.svg";

// Library imports
import axios from "axios";
import { toast } from "react-hot-toast";

// Component imports
import { IconCheck, IconDeviceFloppy, IconEdit } from "@tabler/icons-react";

export default function DayDetailsTable({ given_date }) {
	const { allUsers, userSchedule } = useContext(UserInfoContext);
	const [currentMinutes, setCurrentMinutes] = useState("");
	const [editingAnAppointment, setEditingAnAppointment] = useState(false);
	const [currentAppointment, setCurrentAppointment] = useState(null);
	const { baseUrl } = useContext(BaseUrlContext);
	const [appointments, setAppointments] = useState({});

	const { userToken, refreshLoggedInUserScheduleForDisplayedWeek } = useContext(UserInfoContext);
	useEffect(() => {
		const appointments = basic_functions.getAppointments(userSchedule, given_date);
		setAppointments(appointments);
	}, [userSchedule]);

	async function updateMinutesInAppointment(appointment_id) {
		// update the appointment with the new minutes
		const response = axios.post(
			`${baseUrl}/update-appointment`,
			{
				appointment_id,
				...currentAppointment,
				minutes_of_meeting: currentMinutes,
			},
			{
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			}
		);
		response
			.then(() => {
				setCurrentAppointment(null);
				setEditingAnAppointment(false);
				setCurrentMinutes("");
				refreshLoggedInUserScheduleForDisplayedWeek();
			})
			.catch((error) => {
				console.log(error);
			});
		toast.promise(response, {
			loading: "Updating Minutes of this meeting...",
			success: "Minutes Updated!",
			error: "Error Updating Minutes!",
		});
	}

	return (
		<div>
			{Array.isArray(appointments) && appointments.length > 0 && (
				<table className="table border-2 bg-white my-8">
					{/* header with day and date */}
					<thead>
						<tr>
							<th>Sr No</th>
							<th>Scheduler</th>
							<th>Appointee</th>
							<th>Agenda</th>
							<th>Details</th>
							<th>Status</th>
							<th>Time Slot</th>
							<th>Minutes</th>
							<th>Done?</th>
						</tr>
					</thead>
					{/* body with time slots */}
					<tbody>
						{appointments.map((appointment, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>
										{
											basic_functions.get_people_from_appointment(
												appointment,
												allUsers
											).scheduler.full_name
										}
									</td>
									<td>
										{
											basic_functions.get_people_from_appointment(
												appointment,
												allUsers
											).appointee.full_name
										}
									</td>
									<td>{appointment.title}</td>
									<td>{appointment.description}</td>
									<td>{appointment.status}</td>
									<td>
										{appointment.appointment_time} to{" "}
										{appointment.appointment_end_time}
									</td>
									<td className="flex justify-center items-center min-w-40">
										<textarea
											className="textarea textarea-bordered textarea-sm text-sm w-full"
											placeholder="Minutes of This Meeting"
											disabled={currentAppointment?._id !== appointment._id}
											value={
												editingAnAppointment &&
												currentAppointment?._id === appointment._id
													? currentMinutes
													: appointment.minutes_of_meeting
											}
											onChange={(e) => {
												setCurrentMinutes(e.target.value);
											}}
										></textarea>
										<button
											className="btn btn-sm bg-transparent ml-2 border-none"
											onClick={() => {
												if (
													editingAnAppointment &&
													currentAppointment?._id === appointment._id
												) {
													// you are currently editing this appointment minutes and wanna save it anytime.
													setEditingAnAppointment(false);
													setCurrentAppointment(null);
													// update appointment in the server.
													updateMinutesInAppointment(appointment._id);
												} else if (!editingAnAppointment) {
													// you are not editing this appointment, but may want to.
													setEditingAnAppointment(true);
													setCurrentAppointment(appointment);
													setCurrentMinutes(
														appointment.minutes_of_meeting
													);
												}
											}}
										>
											{editingAnAppointment &&
											currentAppointment?._id === appointment._id ? (
												<IconDeviceFloppy className="w-4 h-4" />
											) : (
												<IconEdit className="w-4 h-4" />
											)}
										</button>
									</td>
									<td>
										<button
											className="btn text-white rounded-md bg-green-300 flex justify-center items-center gap-2 cursor-pointer hover:bg-green-400 transition-all hover:scale-105 duration-200"
											onClick={() => {
												basic_functions.change_status_without_mail(
													appointment,
													"completed",
													baseUrl,
													userToken,
													refreshLoggedInUserScheduleForDisplayedWeek,
													allUsers,
													"Your appointment has been completed"
												);
											}}
											disabled={isPast(
												parse(
													appointment.appointment_time,
													"h:mm a",
													new Date()
												)
											)}
										>
											<div className="flex gap-1">
												<IconCheck className="w-6 h-6" />
												<div className="w-full flex-1 text-nowrap p-1 flex justify-center items-center">
													Mark as Completed
												</div>
											</div>
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
			{
				// if there are no appointments
				!appointments.length && (
					<div className="text-center text-2xl text-gray-500 mt-8 flex flex-col gap-4">
						<img src={NoAppsvg} alt="no appointments" className="w-[20vw] mx-auto" />
						<div className="mt-4">No appointments scheduled for this day</div>
					</div>
				)
			}
		</div>
	);
}

import PropTypes from "prop-types";

DayDetailsTable.propTypes = {
	given_date: PropTypes.string.isRequired,
};
