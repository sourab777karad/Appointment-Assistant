// importing libraries
import React from "react";
import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { parse, set, isAfter, format, isWithinInterval, isEqual } from "date-fns";

// importing context
import { UserInfoContext } from "../context/UserInfoContext";

// importong components
import AppointmentContextMenu from "./context_menus/AppointmentContextMenu";
import BlockContextMenu from "./context_menus/BlockContextMenu";
import { useNavigate } from "react-router-dom";
import {
	IconCaretLeft,
	IconCaretLeftFilled,
	IconCaretRight,
	IconCaretRightFilled,
} from "@tabler/icons-react";

export default function Schedule({
	user_id,
	userSchedule,
	currentWeek,
	handleNextWeekChanged,
	handlePreviousWeekChanged,
	change_status,
	block_appointment,
	unblock_appointment,
	user_time_slots,
	json_time_slots,
}) {
	const navigate = useNavigate();
	// from the context
	const { allUsers, userDetails } = React.useContext(UserInfoContext);

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
		// Parse start_time from "Hmm" format to a Date object
		const parsedStartTime = parse(start_time, "h:mm a", new Date());

		// Combine date1 and start_time into a single Date object
		const dateTime1 = set(date1, {
			hours: parsedStartTime.getHours(),
			minutes: parsedStartTime.getMinutes(),
		});

		// Compare dateTime1 and date2
		return isAfter(dateTime1, date2);
	};

	// check if the current date and time are present in the userschedule
	function checkDivInSchedule(time_slot, date) {
		// timeslot
		// {
		// "start_time": "10:30 AM",
		// "end_time": "10:45 AM"
		// }
		// 12/3/2024 date
		// appointment_time: "10:30 AM"
		// this function will check if the time_slot and date are present in the userSchedule
		// if yes, then it will return the details of the appointment
		// if no, then it will return null
		let taken_appointment = null;
		let given_appointment = null;
		let blocked_appointment = null;
		let pending_appointment = null;
		let completed_appointment = null;

		// look through the userSchedule.taken_appointments to find the appointment with date matching date, and if its time is present in the time_slot
		userSchedule.taken_appointments.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.appointment_time is present in the the times of the json_time_slots
				if (
					isWithinInterval(parse(appointment.appointment_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					})
				) {
					if (appointment.status === "pending") {
						pending_appointment = appointment;
					} else if (appointment.status === "completed") {
						completed_appointment = appointment;
					} else {
						taken_appointment = appointment;
					}
				}
			}
		});

		// look through the userSchedule.given_appointments to find the appointment with date matching date, and if its time is present in the time_slot
		userSchedule.given_appointments.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.appointment_time is present in the the times of the json_time_slots
				if (
					isWithinInterval(parse(appointment.appointment_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					})
				) {
					if (appointment.status === "pending") {
						pending_appointment = appointment;
					} else if (appointment.status === "completed") {
						completed_appointment = appointment;
					} else {
						given_appointment = appointment;
					}
				}
			}
		});

		// look through the userSchedule.blocked_appointments to find the appointment with date matching date, and if its time is present in the time_slot
		userSchedule.blocked_appointments?.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.start_time is between the time_slot.start_time and time_slot.end_time
				if (
					isWithinInterval(parse(appointment.start_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					}) ||
					isEqual(
						parse(appointment.start_time, "h:mm a", new Date()),
						parse(time_slot.start_time, "h:mm a", new Date())
					) ||
					isEqual(
						parse(appointment.end_time, "h:mm a", new Date()),
						parse(time_slot.end_time, "h:mm a", new Date())
					)
				) {
					blocked_appointment = appointment;
				}
			}
		});

		return {
			taken_appointment,
			given_appointment,
			blocked_appointment,
			pending_appointment,
			completed_appointment,
		};
	}

	function checkDivInFacultySchedule(time_slot, date) {
		// this function will go through the entire schedule, but in return it will only give blocked appointments
		let blocked_appointment = null;
		let taken_appointment = null;
		let given_appointment = null;
		let pending_appointment = null;
		let completed_appointment = null;

		userSchedule.blocked_appointments?.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.start_time is between the time_slot.start_time and time_slot.end_time
				if (
					isWithinInterval(parse(appointment.start_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					}) ||
					isEqual(
						parse(appointment.start_time, "h:mm a", new Date()),
						parse(time_slot.start_time, "h:mm a", new Date())
					) ||
					isEqual(
						parse(appointment.end_time, "h:mm a", new Date()),
						parse(time_slot.end_time, "h:mm a", new Date())
					)
				) {
					blocked_appointment = appointment;
				}
			}
		});

		// look through the userSchedule.taken_appointments to find the appointment with date matching date, and if its time is present in the time_slot
		userSchedule.taken_appointments.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				console.log(parse(appointment.appointment_time, "h:mm a", new Date()));
				console.log(parse(time_slot.start_time, "h:mm a", new Date()));
				console.log(
					isEqual(
						parse(appointment.appointment_time, "h:mm a", new Date()),
						parse(time_slot.start_time, "h:mm a", new Date())
					)
				);
				console.log(
					isWithinInterval(parse(appointment.appointment_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					})
				);
				// check if appointment.appointment_time is present in the the times of the json_time_slots
				if (
					isWithinInterval(parse(appointment.appointment_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					})
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
					isWithinInterval(parse(appointment.appointment_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					})
				) {
					console.log("in faculty schedule", {
						taken_appointment,
						given_appointment,
						blocked_appointment,
						pending_appointment,
					});
					blocked_appointment = appointment;
				}
			}
		});

		return {
			taken_appointment,
			given_appointment,
			blocked_appointment,
			pending_appointment,
			completed_appointment,
		};
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
				)
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
			if (user.firebase_id === appointment.scheduler_id) {
				scheduler.full_name = user.full_name;
				scheduler.email = user.email;
				scheduler.room = user.room;
				scheduler.profile_pic_url = user.profile_pic_url;
				scheduler.phone_number = user.phone_number;
			}
			if (user.firebase_id === appointment.appointee_id) {
				appointee.full_name = user.full_name;
				appointee.email = user.email;
				appointee.room = user.room;
				appointee.profile_pic_url = user.profile_pic_url;
				appointee.phone_number = user.phone_number;
			}
		});
		return {
			scheduler: scheduler,
			appointee: appointee,
		};
	}

	// hooks

	useEffect(() => {
		// check block privileges
		console.log("block privileges", userSchedule, userDetails);
		if (user_id === userDetails.firebase_id) {
			setBlockPrivileges(true);
		} else {
			setBlockPrivileges(false);
		}
	}, [userSchedule, userDetails]);

	useEffect(() => {
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
					unblock_appointment={unblock_appointment}
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
			{/* legend */}
			<div className="flex flex-row justify-end gap-5 mb-6">
				<div className="flex flex-row gap-3 items-center">
					<div className="w-5 h-5 bg-green-100"></div>
					<div>Completed</div>
				</div>
				<div className="flex flex-row gap-3 items-center">
					<div className="w-5 h-5 bg-blue-100"></div>
					<div>Scheduled</div>
				</div>
				<div className="flex flex-row gap-3 items-center">
					<div className="w-5 h-5 bg-yellow-100"></div>
					<div>Pending</div>
				</div>
				<div className="flex flex-row gap-3 items-center">
					<div className="w-5 h-5 bg-red-100"></div>
					<div>Blocked</div>
				</div>
			</div>
			{/* this is where we will show next and previous month and week on the right side, and current month on left side */}
			<div className="flex justify-between flex-row-reverse gap-4 my-4">
				{/* current month and week */}
				<div className="flex gap-4">
					<div className="text-xl flex items-center justify-center font-semibold text-gray-800 uppercase">
						Week 12 (18 - 24)
					</div>{" "}
					<div className="text-2xl flex items-center justify-center font-semibold text-blue-800 uppercase">
						March
					</div>
					<div className="text-2xl flex items-center justify-center font-semibold text-blue-800 uppercase">
						2024
					</div>
				</div>

				{/* month changer and week changer */}
				<div className="flex gap-8">
					{/* week */}
					<div className="flex gap-0 border-2 border-gray-400 rounded-lg bg-white">
						<div className="border-r-2 border-gray-400 hover:bg-gray-300 rounded-l-md flex justify-center items-center px-2">
							<IconCaretLeftFilled className="w-6 h-6" />
						</div>
						<div className="px-2 min-w-24 text-center flex justify-center items-center text-xl">
							Week
						</div>
						<div className="border-l-2 border-gray-400 hover:bg-gray-300 rounded-r-md flex justify-center items-center px-2">
							{" "}
							<IconCaretRightFilled className="w-6 h-6" />
						</div>
					</div>
					{/* month */}
					<div className="flex gap-0 border-2 border-gray-400 rounded-lg bg-white">
						<div className="border-r-2 border-gray-400 hover:bg-gray-300 rounded-l-md flex justify-center items-center px-2">
							<IconCaretLeftFilled className="w-6 h-6" />
						</div>
						<div className="px-2 min-w-24 text-center flex justify-center items-center text-xl">
							March
						</div>
						<div className="border-l-2 border-gray-400 hover:bg-gray-300 rounded-r-md flex justify-center items-center px-2">
							{" "}
							<IconCaretRightFilled className="w-6 h-6" />
						</div>
					</div>
					{/* Year */}
					<div className="flex gap-0 border-2 border-gray-400 rounded-lg bg-white">
						<div className="border-r-2 border-gray-400 hover:bg-gray-300 rounded-l-md flex justify-center items-center px-2">
							<IconCaretLeftFilled className="w-6 h-6" />
						</div>
						<div className="px-2 min-w-24 text-center flex justify-center items-center text-xl">
							2024
						</div>
						<div className="border-l-2 border-gray-400 hover:bg-gray-300 rounded-r-md flex justify-center items-center px-2">
							{" "}
							<IconCaretRightFilled className="w-6 h-6" />
						</div>
					</div>
				</div>
			</div>
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
										"hover:bg-blue-50 hover:cursor-pointer border w-[13vw] p-2 text-xl text-center" +
										(day === "Today" ? " bg-green-100" : "")
									}
									onContextMenu={(e) => {
										handleBlockContextMenu(e, day);
									}}
									onClick={() => {
										if (blockPrivileges) {
											console.log("block privileges exist");
											navigate("/day-details", {
												state: {
													date: format(
														get_week_dates_from_start_date()[index],
														"yyyy-MM-dd"
													),
													json_time_slots: json_time_slots,
													user_time_slots: user_time_slots,
													day: day,
												},
											});
										}
										handleCloseMenu();
									}}
								>
									{day} <br />{" "}
									{format(get_week_dates_from_start_date()[index], "yyyy-MM-dd")}
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
									className="border-2 min-w-56 p-2 text-xl text-center hover:bg-blue-50"
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
									let current_div_schedule;
									if (blockPrivileges) {
										current_div_schedule = checkDivInSchedule(
											time_slot,
											format(date, "yyyy-MM-dd")
										);
									} else {
										current_div_schedule = checkDivInFacultySchedule(
											time_slot,
											format(date, "yyyy-MM-dd")
										);
										console.log("found something", current_div_schedule);
									}
									let current_appointment = current_div_schedule.taken_appointment
										? current_div_schedule.taken_appointment
										: current_div_schedule.given_appointment
											? current_div_schedule.given_appointment
											: [
													{
														start_time: time_slot.start_time,
														end_time: time_slot.end_time,
														appointment_date: format(
															date,
															"yyyy-MM-dd"
														),
													},
												];

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
											key={format(date, "yyyy-MM-dd")}
											className={
												"border-2 p-2 " +
												(current_div_schedule.blocked_appointment !== null
													? " bg-red-100 "
													: "") +
												(current_div_schedule.taken_appointment !== null
													? " bg-blue-100 "
													: "") +
												(current_div_schedule.given_appointment !== null
													? " bg-blue-100 "
													: "") +
												(current_div_schedule.completed_appointment !== null
													? " bg-green-100 "
													: "") +
												(current_div_schedule.pending_appointment !== null
													? " bg-yellow-100 "
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
													) ||
													(current_div_schedule.blocked_appointment !==
														null &&
														!blockPrivileges)
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
											<div className="flex flex-col gap-1 justify-center items-center text-sm font-semibold">
												<div className="flex justify-center text-center w-full">
													{current_div_schedule.taken_appointment !== null
														? "Taken : " +
															taken_person_info?.appointee.full_name
														: ""}
													{current_div_schedule.given_appointment !== null
														? "Given : " +
															given_person_info?.scheduler.full_name
														: ""}{" "}
												</div>
												<div className="text-sm flex justify-center items-center text-center">
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
