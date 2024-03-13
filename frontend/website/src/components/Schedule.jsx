import React from "react";
import { useState, useContext, useEffect } from "react";
import { UserInfoContext } from "../context/UserInfoContext";
import PropTypes from "prop-types";

const getCurrentTimeAsInteger = () => {
	const currentDate = new Date();
	const hours = String(currentDate.getHours()).padStart(2, "0");
	const minutes = String(currentDate.getMinutes()).padStart(2, "0");
	const timeInteger = parseInt(hours + minutes, 10);
	return timeInteger;
};

const CustomContextMenu = ({ x, y, onClose, appointment, change_status }) => {
	const handleClick = (e) => {
		e.preventDefault(); // Prevent default right-click menu
		onClose(); // Close custom menu
	};

	return (
		<div
			className="custom-menu absolute z-50"
			style={{
				top: y,
				left: x,
			}}
			onClick={handleClick}
		>
			<div className="p-2">
				<ul className="menu bg-base-200 w-56 rounded-box">
					<li
						onClick={() => {
							console.log(appointment, "clicked");
							change_status(appointment, "cancelled");
						}}
					>
						<a>Cancel Appointment</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default function Schedule({
	userSchedule,
	currentWeek,
	handleNextWeekChanged,
	handlePreviousWeekChanged,
	change_status,
	user_time_slots,
	json_time_slots,
}) {

	// from the context
	const allUsers = React.useContext(UserInfoContext).allUsers;
	
	// for the right click menu
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [currentAppointmentRightClick, setCurrentAppointmentForRightClick] = useState(null);
	const [showMenu, setShowMenu] = useState(false);
	const setCurrentAppointmentForPanel = useContext(UserInfoContext).setCurrentAppointment;

	// functions for the menu
	const handleContextMenu = (e, current_appointment) => {
		setCurrentAppointmentForRightClick(current_appointment);
		console.log(e);
		e.preventDefault(); // Prevent default right-click menu
		const scrollX = window.scrollX || window.pageXOffset;
		const scrollY = window.scrollY || window.pageYOffset;
		setMenuPosition({ x: e.clientX + scrollX, y: e.clientY + scrollY });
		setShowMenu(true);
	};

	const handleCloseMenu = () => {
		setShowMenu(false);
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

	useEffect(() => {
		console.log(currentWeek)
		const handleScroll = () => {
			if (showMenu) {
				setShowMenu(false); // Close menu when scrolling
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [showMenu]);

	return (
		<div className="p-8 ">
			{showMenu && (
				<CustomContextMenu
					appointment={currentAppointmentRightClick}
					x={menuPosition.x}
					y={menuPosition.y}
					onClose={handleCloseMenu}
					change_status={change_status}
				/>
			)}
			<table className="table border-2 bg-white">
				{/* head */}
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
										"border w-[13vw] p-2 text-xl text-center" +
										(day === "Today" ? " bg-green-100" : "")
									}
								>
									{day} <br /> {get_week_dates_from_start_date()[index]}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{json_time_slots.map((time_slot, index) => {
						return (
							<tr key={user_time_slots[index]}>
								<td className="border-2 p-2 text-xl text-center ">
									{user_time_slots[index]}
								</td>
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
													? "bg-red-100 "
													: "") +
												(current_div_schedule.given_appointment !== null
													? "bg-blue-100 "
													: "") +
												(getCurrentTimeAsInteger() > time_slot.start_time &&
												new Date() > new Date(date)
													? "diaglines"
													: "")
											}
											onContextMenu={(e) => {
												handleContextMenu(e, current_appointment);
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
};

CustomContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
};
