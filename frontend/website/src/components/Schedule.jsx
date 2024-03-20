// importing libraries
import React from "react";
import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { parse, set, isAfter, format, isWithinInterval, isEqual } from "date-fns";

// importing context
import { UserInfoContext } from "../context/UserInfoContext";

// importing utitlities
import basic_functions from "./../utils/basic_functions";

// importing components
import AppointmentContextMenu from "./context_menus/AppointmentContextMenu";
import BlockContextMenu from "./context_menus/BlockContextMenu";
import { useNavigate } from "react-router-dom";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";

export default function Schedule({
	user_id,
	userSchedule,
	currentWeek,
	handleDateIncreased,
	handleDateDecreased,
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
	const [currentRightClickDate, setCurrentRightClickDate] = useState(null);
	const [currentRightClickTimeSlot, setCurrentRightClickTimeSlot] = useState(null);

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
		// this function will return the appointment, and along with that some generic information that we can display.
		// we know for a fact that some appointments can coincide.
		// lets first go through all the appointment lists in the userSchedule
		let our_appointment = null;
		console.log(userSchedule);
		userSchedule?.blocked_appointments?.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				console.log(appointment)
				console.log("what the hell", userSchedule)
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
					our_appointment = appointment;
					our_appointment.type = "blocked";
					// we know nothing is going to be booked if the appointment is blocked, so we can return the appointment right away
					our_appointment.concerned_party = "";
				}
			}
		});

		// if there is a blocked appointment, then we can return the appointment right away
		if (our_appointment) {
			return our_appointment;
		}

		userSchedule.taken_appointments.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.appointment_time is present in the the times of the json_time_slots
				if (
					isWithinInterval(parse(appointment.appointment_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					})
				) {
					our_appointment = appointment;
					// check if its confirmed or pending
					if (our_appointment.status === "confirmed") {
						our_appointment.type = "Taken and Confirmed";
					} else if (our_appointment.status === "pending") {
						our_appointment.type = "Pending Their Confirmation";
					} else if (our_appointment.status === "cancelled") {
						our_appointment.type = "Free";
						our_appointment.concerned_party = "Free";
					}
					// you can only possibly have one taken appointment at a time, so we can return the appointment right away
					our_appointment.concerned_party = basic_functions.get_people_from_appointment(
						our_appointment,
						allUsers
					).appointee;
				}
			}
		});
		if (our_appointment) {
			return our_appointment;
		}

		let given_appointments = [];
		userSchedule.given_appointments.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.appointment_time is present in the the times of the json_time_slots
				if (
					isWithinInterval(parse(appointment.appointment_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					})
				) {
					given_appointments.push(appointment);
				}
			}
		});

		// if there are multiple given appointments, then we will return redirect user to notifications
		if (given_appointments.length > 1) {
			our_appointment.type = "Multiple Requests";
			return {
				type: "Multiple Requests",
				concerned_party: "Multiple Requests",
			};
		}

		// if there is only one given appointment, then we will check its status
		if (given_appointments.length === 1) {
			our_appointment = given_appointments[0];
			our_appointment.concerned_party = get_names_from_appointment(our_appointment).scheduler;

			// check if its confirmed or pending
			if (our_appointment.status === "confirmed") {
				our_appointment.type = "Given and Confirmed";
			} else if (our_appointment.status === "pending") {
				our_appointment.type = "Pending Your Confirmation";
			} else if (our_appointment.status === "cancelled") {
				our_appointment.type = "Free";
				our_appointment.concerned_party = "Free";
			}
			return our_appointment;
		}

		return {
			type: "Free",
			concerned_party: "Free",
			start_time: time_slot.start_time,
			end_time: time_slot.end_time,
			appointment_date: date,
		};
	}

	// check if the current date and time are present in the userschedule
	function checkDivInFacultySchedule(time_slot, date) {
		// this function will return the appointment, and along with that some generic information that we can display.
		// we know for a fact that some appointments can coincide.
		// lets first go through all the appointment lists in the userSchedule
		let our_appointment = null;
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
					our_appointment = appointment;
					our_appointment.type = "blocked";
					// we know nothing is going to be booked if the appointment is blocked, so we can return the appointment right away
					our_appointment.concerned_party = "";
				}
			}
		});

		// if there is a blocked appointment, then we can return the appointment right away
		if (our_appointment) {
			return our_appointment;
		}

		userSchedule.taken_appointments.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.appointment_time is present in the the times of the json_time_slots
				if (
					isWithinInterval(parse(appointment.appointment_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					})
				) {
					our_appointment = appointment;
					if (our_appointment.status === "cancelled") {
						our_appointment.type = "Free";
					}
					our_appointment.type = "blocked";
				}
			}
		});
		if (our_appointment) {
			return our_appointment;
		}

		let given_appointments = [];
		userSchedule.given_appointments.forEach((appointment) => {
			if (appointment.appointment_date === date) {
				// check if appointment.appointment_time is present in the the times of the json_time_slots
				if (
					isWithinInterval(parse(appointment.appointment_time, "h:mm a", new Date()), {
						start: parse(time_slot.start_time, "h:mm a", new Date()),
						end: parse(time_slot.end_time, "h:mm a", new Date()),
					})
				) {
					given_appointments.push(appointment);
				}
			}
		});

		// if there are multiple given appointments, then we will return redirect user to notifications
		if (given_appointments.length > 1) {
			// check if any of them is confirmed
			let confirmed = false;
			given_appointments.forEach((appointment) => {
				if (appointment.status === "confirmed") {
					confirmed = true;
				}
			});
			// if any of them is confirmed, then return blocked
			if (confirmed) {
				return {
					type: "blocked",
					concerned_party: "Multiple Requests",
				};
			}
			// else you are free to book
			return {
				type: "Free",
				concerned_party: "Multiple Requests",
			};
		}

		// if there is only one given appointment, then we will check its status
		if (given_appointments.length === 1) {
			our_appointment = given_appointments[0];

			// check if its confirmed or pending
			if (our_appointment.status === "confirmed") {
				our_appointment.type = "blocked";
			} else {
				our_appointment.type = "Free";
			}
			return our_appointment;
		}

		return {
			type: "Free",
			start_time: time_slot.start_time,
			end_time: time_slot.end_time,
			appointment_date: date,
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
			if (week[i].toLocaleDateString() === today.toLocaleDateString()) {
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

	useEffect(() => {
		if (!user_time_slots) {
			return;
		}
		if (!json_time_slots) {
			return;
		}
		// if any of the fields are empty, then return
		if (!userSchedule) {
			return;
		}
		if (!userSchedule.taken_appointments) {
			return;
		}
		if (!userSchedule.given_appointments) {
			return;
		}
		if (!userSchedule.blocked_appointments) {
			return;
		}
	}, []);

	// hooks

	useEffect(() => {
		console.log(currentWeek);
	}, [currentWeek]);

	useEffect(() => {
		// check block privileges
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
					blockPrivileges={blockPrivileges}
				/>
			)}
			{showBlockMenu && (
				<BlockContextMenu
					x={menuPosition.x}
					y={menuPosition.y}
					onClose={handleCloseMenu}
					date={currentRightClickDate}
					time_slot={currentRightClickTimeSlot}
				/>
			)}
			{/* legend */}
			<div className="flex flex-row justify-end gap-5 mb-6">
				<div className="flex flex-row gap-3 items-center">
					<div className="w-5 h-5 bg-green-200 font-semibold"></div>
					<div className="font-semibold">Completed</div>
				</div>
				<div className="flex flex-row gap-3 items-center">
					<div className="w-5 h-5 bg-blue-200 font-semibold"></div>
					<div className="font-semibold">Scheduled</div>
				</div>
				<div className="flex flex-row gap-3 items-center">
					<div className="w-5 h-5 bg-yellow-200 font-semibold"></div>
					<div className="font-semibold">Pending Their Confirmation</div>
				</div>
				<div className="flex flex-row gap-3 items-center">
					<div className="w-5 h-5 bg-orange-200 font-semibold"></div>
					<div className="font-semibold">Pending Your Confirmation</div>
				</div>
				<div className="flex flex-row gap-3 items-center">
					<div className="w-5 h-5 bg-red-200 font-semibold"></div>
					<div className="font-semibold">Blocked</div>
				</div>
			</div>
			{/* this is where we will show next and previous month and week on the right side, and current month on left side */}
			<div className="flex justify-between flex-row-reverse gap-4 my-4">
				{/* current month and week */}
				<div className="flex gap-4">
					<div className="text-xl flex items-center justify-center font-semibold text-gray-800 uppercase">
						{basic_functions.get_current_week(currentWeek)}
					</div>{" "}
					<div className="text-2xl flex items-center justify-center font-semibold text-blue-800 uppercase">
						{basic_functions.get_current_month(currentWeek)}
					</div>
					<div className="text-2xl flex items-center justify-center font-semibold text-blue-800 uppercase">
						{basic_functions.get_current_year(currentWeek)}
					</div>
				</div>

				{/* month changer and week changer */}
				<div className="flex gap-8">
					{/* week */}
					<div className="flex gap-0 border-2 border-gray-400 rounded-lg bg-white">
						<div
							className="border-r-2 border-gray-400 hover:bg-gray-300 rounded-l-md flex justify-center items-center px-2"
							onClick={() => {
								handleDateDecreased(7);
							}}
						>
							<IconCaretLeftFilled className="w-6 h-6" />
						</div>
						<div className="px-2 min-w-24 text-center flex justify-center items-center text-xl">
							{basic_functions.get_current_month_week(currentWeek)}
						</div>
						<div
							className="border-l-2 border-gray-400 hover:bg-gray-300 rounded-r-md flex 	justify-center items-center px-2"
							onClick={() => {
								handleDateIncreased(7);
							}}
						>
							{" "}
							<IconCaretRightFilled className="w-6 h-6" />
						</div>
					</div>
					{/* month */}
					<div className="flex gap-0 border-2 border-gray-400 rounded-lg bg-white">
						<div
							className="border-r-2 border-gray-400 hover:bg-gray-300 rounded-l-md flex justify-center items-center px-2"
							onClick={() => {
								handleDateDecreased(28);
							}}
						>
							<IconCaretLeftFilled className="w-6 h-6" />
						</div>
						<div className="px-2 min-w-24 text-center flex justify-center items-center text-xl">
							{basic_functions.get_current_month(currentWeek)}
						</div>
						<div
							className="border-l-2 border-gray-400 hover:bg-gray-300 rounded-r-md flex justify-center items-center px-2"
							onClick={() => {
								handleDateIncreased(28);
							}}
						>
							{" "}
							<IconCaretRightFilled className="w-6 h-6" />
						</div>
					</div>
					{/* Year */}
					<div className="flex gap-0 border-2 border-gray-400 rounded-lg bg-white">
						<div
							className="border-r-2 border-gray-400 hover:bg-gray-300 rounded-l-md flex justify-center items-center px-2"
							onClick={() => {
								handleDateDecreased(365);
							}}
						>
							<IconCaretLeftFilled className="w-6 h-6" />
						</div>
						<div className="px-2 min-w-24 text-center flex justify-center items-center text-xl">
							{basic_functions.get_current_year(currentWeek)}
						</div>
						<div
							className="border-l-2 border-gray-400 hover:bg-gray-300 rounded-r-md flex justify-center items-center px-2"
							onClick={() => {
								handleDateIncreased(365);
							}}
						>
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
										setCurrentRightClickDate(
											format(
												get_week_dates_from_start_date()[index],
												"yyyy-MM-dd"
											)
										);
										setCurrentRightClickTimeSlot("");
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
										handleBlockContextMenu(e);
										setCurrentRightClickDate("");
										setCurrentRightClickTimeSlot(time_slot);
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
									// if you are the one checking your schedule, then you have the block privileges
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
									}

									return (
										<td
											key={format(date, "yyyy-MM-dd")}
											className={
												"border-2 p-2 " +
												(current_div_schedule?.type === "blocked"
													? " bg-red-100 "
													: "") +
												(current_div_schedule?.type ===
												"Taken and Confirmed"
													? " bg-blue-200 "
													: "") +
												(current_div_schedule?.type ===
												"Pending Their Confirmation"
													? " bg-yellow-200 "
													: "") +
												(current_div_schedule?.type ===
												"Given and Confirmed"
													? " bg-blue-200 "
													: "") +
												(current_div_schedule?.type ===
												"Pending Your Confirmation"
													? " bg-orange-200 "
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
												// only able to click if the time is in the future
												if (
													compare_time_and_date(
														time_slot.start_time,
														date,
														new Date()
													)
												) {
													// if you dont have block privileges and if the appointment type is blocked,
													// then return
													if (
														current_div_schedule?.type === "blocked" &&
														!blockPrivileges
													) {
														handleContextMenuDisabled(e);
														return;
													}
													handleAppointmentContextMenu(
														e,
														current_div_schedule
													);
												}
												handleContextMenuDisabled(e);
											}}
											onClick={() => {
												// only able to click if the time is in the future if appointment is not blocked, and its not free.
												if (
													!compare_time_and_date(
														time_slot.start_time,
														date,
														new Date()
													) ||
													(current_div_schedule?.type === "blocked" &&
														!blockPrivileges) ||
													current_div_schedule?.type === "Free"
												) {
													handleCloseMenu();
													return;
												}
												// if the appointment is blocked, then return
												if (current_div_schedule?.type === "blocked") {
													return;
												}
												// all other cases, open panel
												setCurrentAppointmentForPanel(current_div_schedule);
												document.getElementById(
													"appointment-drawer"
												).checked = true;

												// close the menu
												handleCloseMenu();
											}}
										>
											<div className="flex flex-col gap-1 justify-center items-center text-sm font-semibold">
												<div className="flex justify-center text-center w-full">
													{
														current_div_schedule?.concerned_party
															?.full_name
													}
												</div>
												<div className="text-sm flex justify-center items-center text-center">
													{current_div_schedule?.concerned_party?.room}
												</div>
												<div className="text-sm flex justify-center items-center text-center">
													{current_div_schedule?.type}
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
	handleDateIncreased: PropTypes.func.isRequired,
	handleDateDecreased: PropTypes.func.isRequired,
	user_time_slots: PropTypes.array.isRequired,
	json_time_slots: PropTypes.array.isRequired,
	user_id: PropTypes.string.isRequired,
};

AppointmentContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
};
