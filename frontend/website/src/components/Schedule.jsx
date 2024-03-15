// importing libraries
import React from "react";
import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { parse, set, isAfter } from "date-fns";

// importing context
import { UserInfoContext } from "../context/UserInfoContext";

// importong components
import AppointmentContextMenu from "./context_menus/AppointmentContextMenu";
import BlockContextMenu from "./context_menus/BlockContextMenu";
import { useNavigate } from "react-router-dom";

export default function Schedule({
	userSchedule,
	currentWeek,
	handleNextWeekChanged,
	handlePreviousWeekChanged,
	change_status,
	block_appointment,
	user_time_slots,
	json_time_slots,
}) {
	const navigate = useNavigate();
	// from the context
	const allUsers = React.useContext(UserInfoContext).allUsers;
	const userDetails = React.useContext(UserInfoContext).userDetails;

	// for the right click menu
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [blockPrivileges, setBlockPrivileges] = useState(false);
	const [currentAppointmentRightClick, setCurrentAppointmentForRightClick] = useState(null);
	const [showAppointmentMenu, setShowAppointmentMenu] = useState(false);
	const [showBlockMenu, setShowBlockMenu] = useState(false);
	const setCurrentAppointmentForPanel = useContext(UserInfoContext).setCurrentAppointment;

	const handleContextMenuDisabled = (e) => {
		e.preventDefault(); // Prevent default right-click menu
	};

	const handleCloseMenu = () => {
		setShowAppointmentMenu(false);
		setShowBlockMenu(false);
	};

	const handleAppointmentContextMenu = (e, current_appointment) => {
		e.preventDefault(); // Prevent default right-click menu
		// if x is too close to the edge of the window, then move the menu to the left
		if (window.innerWidth - e.pageX < 300) {
			setMenuPosition({ x: e.pageX - 200, y: e.pageY });
		} else {
			setMenuPosition({ x: e.pageX, y: e.pageY });
		}
		setShowAppointmentMenu(true);
		if (current_appointment) {
			setCurrentAppointmentForRightClick(current_appointment);
		}
	};

	const handleBlockContextMenu = (e) => {
		// if the id in userdetails doenst match the id the the userschedule.givenappointments.scheduler, then return
		if (!blockPrivileges) {
			return;
		}
		e.preventDefault(); // Prevent default right-click menu
		// if x is too close to the edge of the window, then move the menu to the left
		if (window.innerWidth - e.pageX < 300) {
			setMenuPosition({ x: e.pageX - 200, y: e.pageY });
		} else {
			setMenuPosition({ x: e.pageX, y: e.pageY });
		}
		setShowBlockMenu(true);
	};

	// function to check time and date. if the time and date are in the past, then return false, else return true
	const compare_time_and_date = (start_time, date1, date2) => {
		// Parse date1 from "dd/mm/yyyy" format to a Date object
		const parsedDate1 = parse(date1, "dd/MM/yyyy", new Date());

		// Parse start_time from "Hmm" format to a Date object
		const parsedStartTime = parse(start_time, "h:mm a", new Date());

		// Combine date1 and start_time into a single Date object
		const dateTime1 = set(parsedDate1, {
			hours: parsedStartTime.getHours(),
			minutes: parsedStartTime.getMinutes(),
		});

		// Compare dateTime1 and date2
		return isAfter(dateTime1, date2);
	};

	// check if the current date and time are present in the userschedule
	function checkDivInSchedule(time_slot, date) {
		// this function will check if the time_slot and date are present in the userSchedule
		// if yes, then it will return the details of the appointment
		// if no, then it will return null
		let taken_appointment = null;
		let given_appointment = null;
		// look through the userSchedule.taken_appointments to find the appointment with date matching date, and if its time is present in the time_slot
		userSchedule.taken_appointments.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.appointment_time is present in the the times of the json_time_slots
				if (
					appointment.appointment_time >= time_slot.start_time &&
					appointment.appointment_time <= time_slot.end_time
				) {
					taken_appointment = appointment;
				}
			}
		});

		// look through the userSchedule.given_appointments to find the appointment with date matching date, and if its time is present in the time_slot
		userSchedule.given_appointments.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.appointment_time is present in the the times of the json_time_slots
				if (
					appointment.appointment_time >= time_slot.start_time &&
					appointment.appointment_time <= time_slot.end_time
				) {
					given_appointment = appointment;
				}
			}
		});
		return { taken_appointment, given_appointment };
	}

	// function to get the week dates from the start date
	function get_week_dates_from_start_date() {
		// this will return an array of dates from the currentWeek.start_date to currentWeek.end_date in the format "dd-mm-yyyy"
		var week = [];
		for (var i = 0; i < 6; i++) {
			week.push(
				new Date(
					currentWeek.start_date.getFullYear(),
					currentWeek.start_date.getMonth(),
					currentWeek.start_date.getDate() + i
				).toLocaleDateString()
			);
		}
		return week;
	}

	// function to make a week from the start date and return the whole week
	function make_week_from_start_date(start_date) {
		// this will take the start_date and end_date and return an array of dates from start_date to end_date
		const monday = new Date(start_date);
		var week = [];
		for (var i = 0; i < 6; i++) {
			week.push(new Date(monday));
			monday.setDate(monday.getDate() + 1);
		}
		return week;
	}

	// function to get the week from week dates return a list of weekdays as string. if the date is of today, it will return "Today"
	function get_week_from_week_dates(week) {
		// this will take an array of week dates. from that, it will return an array that contains "Monday", or "Tuesday", but if the date is of today, it will return "Today"
		var week_days = [];
		var today = new Date();
		for (var i = 0; i < week.length; i++) {
			if (week[i].getDate() === today.getDate()) {
				week_days.push("Today");
			} else {
				week_days.push(week[i].toLocaleString("default", { weekday: "long" }));
			}
		}
		return week_days;
	}

	// function to user information from appointment.
	function get_names_from_appointment(appointment) {
		if (appointment === null) {
			return null;
		}
		// find the user.firebase_id in allUsers matching with appointment.scheduler and apppointment.appointee
		let scheduler = {};
		let appointee = {};
		allUsers.forEach((user) => {
			if (user.firebase_id === appointment.scheduler) {
				scheduler.full_name = user.full_name;
				scheduler.email = user.email;
				scheduler.room = user.room;
				scheduler.profile_pic_url = user.profile_pic_url;
				scheduler.phone_number = user.phone_number;
			}
			if (user.firebase_id === appointment.appointee) {
				appointee.full_name = user.full_name;
				appointee.email = user.email;
				appointee.room = user.room;
				appointee.profile_pic_url = user.profile_pic_url;
				appointee.phone_number = user.phone_number;
			}
		});
		console.log(scheduler, appointee);
		return {
			scheduler: scheduler,
			appointee: appointee,
		};
	}

	// hooks

	useEffect(() => {
		// check block privileges
		console.log("block privileges", userSchedule, userDetails);
		if (userSchedule.given_appointments.length > 0) {
			if (userSchedule.given_appointments[0].appointee === userDetails.firebase_id) {
				setBlockPrivileges(true);
			} else {
				setBlockPrivileges(false);
			}
		}
	}, [userSchedule, userDetails]);

	useEffect(() => {
		console.log(currentWeek);
		const handleScroll = () => {
			if (showAppointmentMenu) {
				setShowAppointmentMenu(false); // Close menu when scrolling
				setShowBlockMenu(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [showAppointmentMenu, setShowBlockMenu]);

	return (
		<div className="p-8 ">
			{showAppointmentMenu && (
				<AppointmentContextMenu
					appointment={currentAppointmentRightClick}
					x={menuPosition.x}
					y={menuPosition.y}
					onClose={handleCloseMenu}
					change_status={change_status}
					block_appointment={block_appointment}
					blockPrivileges={blockPrivileges}
				/>
			)}
			{showBlockMenu && (
				<BlockContextMenu
					x={menuPosition.x}
					y={menuPosition.y}
					onClose={handleCloseMenu}
					change_status={change_status}
				/>
			)}
			{/* <div className="flex justify-between items-center">
				<button
					onClick={handlePreviousWeekChanged}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Previous Week
				</button>
				<h1 className="text-3xl font-semibold text-center mt-4 text-blue-800">
					{currentWeek.start_date.toLocaleDateString()} -{" "}
					{currentWeek.end_date.toLocaleDateString()}
				</h1>
				<button
					onClick={handleNextWeekChanged}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Next Week
				</button>
			</div> */}

			{/* the table with the schedule */}
			<table className="table border-2 bg-white">
				{/* header with day and date */}
				<thead>
					<tr>
						<th></th>
						{get_week_from_week_dates(
							make_week_from_start_date(currentWeek.start_date)
						).map((day, index) => {
							return (
								<th
									key={day}
									className={
										"hover:bg-blue-50 border w-[13vw] p-2 text-xl text-center" +
										(day === "Today" ? " bg-green-100" : "")
									}
									onContextMenu={(e) => {
										handleBlockContextMenu(e, day);
									}}
									onClick={() => {
										console.log("clicked day");
										if (blockPrivileges) {
											console.log("block privileges exist");
											navigate("/day-details", {
												state: {
													date: get_week_dates_from_start_date()[index],
													json_time_slots: json_time_slots,
													user_time_slots: user_time_slots,
													day: day,
												},
											});
										}
										handleCloseMenu();
									}}
								>
									{day} <br /> {get_week_dates_from_start_date()[index]}
								</th>
							);
						})}
					</tr>
				</thead>

				{/* body with time slots */}
				<tbody>
					{json_time_slots.map((time_slot, index) => {
						return (
							<tr key={user_time_slots[index]}>
								{/* first column will be the time slot */}
								<td
									className="border-2 p-2 text-xl text-center hover:bg-blue-50"
									onContextMenu={(e) => {
										handleBlockContextMenu(e, time_slot);
									}}
									onClick={() => {
										console.log("clicked");
										handleCloseMenu();
									}}
								>
									{user_time_slots[index]}
								</td>

								{/* rest of the columns are mapped to the slots */}

								{get_week_dates_from_start_date().map((date) => {
									const current_div_schedule = checkDivInSchedule(
										time_slot,
										date
									);
									const current_appointment =
										current_div_schedule.taken_appointment
											? current_div_schedule.taken_appointment
											: current_div_schedule.given_appointment
												? current_div_schedule.given_appointment
												: null;
									// check if the appointment is confirmed or not
									if (
										current_div_schedule.taken_appointment !== null &&
										current_div_schedule.taken_appointment.status !==
											"confirmed"
									) {
										current_div_schedule.taken_appointment = null;
									}

									if (
										current_div_schedule.given_appointment !== null &&
										current_div_schedule.given_appointment.status !==
											"confirmed"
									) {
										current_div_schedule.given_appointment = null;
									}

									const taken_person_info = get_names_from_appointment(
										current_div_schedule?.taken_appointment
									);
									const given_person_info = get_names_from_appointment(
										current_div_schedule?.given_appointment
									);
									return (
										<td
											key={date}
											className={
												"border-2 p-2 " +
												(current_div_schedule.taken_appointment !== null
													? " bg-red-100 "
													: "") +
												(current_div_schedule.given_appointment !== null
													? " bg-blue-100 "
													: "") +
												(!compare_time_and_date(
													time_slot.start_time,
													date,
													new Date()
												)
													? "diaglines"
													: "hover:bg-gray-300")
											}
											onContextMenu={(e) => {
												if (
													!compare_time_and_date(
														time_slot.start_time,
														date,
														new Date()
													)
												) {
													handleContextMenuDisabled(e);
													return;
												}
												handleAppointmentContextMenu(
													e,
													current_appointment
												);
											}}
											onClick={() => {
												if (
													current_div_schedule.taken_appointment !== null
												) {
													setCurrentAppointmentForPanel({
														appointment:
															current_div_schedule.taken_appointment,
														person: taken_person_info.appointee,
													});
													document.getElementById(
														"appointment-drawer"
													).checked = true;
												} else if (
													current_div_schedule.given_appointment !== null
												) {
													setCurrentAppointmentForPanel({
														appointment:
															current_div_schedule.given_appointment,
														person: given_person_info.scheduler,
													});
													document.getElementById(
														"appointment-drawer"
													).checked = true;
												}

												// close the menu
												handleCloseMenu();
											}}
										>
											<div className="flex flex-col gap-1 justify-center items-center">
												<div>
													{current_div_schedule.taken_appointment !== null
														? "Taken : " +
															taken_person_info?.appointee.full_name
														: ""}
													{current_div_schedule.given_appointment !== null
														? "Given : " +
															given_person_info?.scheduler.full_name
														: ""}{" "}
												</div>
												<div>
													{current_div_schedule.taken_appointment !== null
														? taken_person_info?.appointee.room
														: ""}
													{current_div_schedule.given_appointment !== null
														? given_person_info?.scheduler.room
														: ""}{" "}
												</div>
											</div>
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

//  props validation
Schedule.propTypes = {
	userSchedule: PropTypes.object.isRequired,
	currentWeek: PropTypes.object.isRequired,
	handleNextWeekChanged: PropTypes.func.isRequired,
	handlePreviousWeekChanged: PropTypes.func.isRequired,
	change_status: PropTypes.func.isRequired,
	user_time_slots: PropTypes.array.isRequired,
	json_time_slots: PropTypes.array.isRequired,
};

AppointmentContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
};
