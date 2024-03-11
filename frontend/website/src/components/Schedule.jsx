import React from "react";
import { useState, useContext, useEffect } from "react";
import { UserInfoContext } from "../context/UserInfoContext";

const CustomContextMenu = ({ x, y, onClose }) => {
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
					<li>
						<a>Cancel Appointment</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default function Schedule({ userSchedule }) {
	const user_time_slots = React.useContext(UserInfoContext).time_slots;
	const json_time_slots = React.useContext(UserInfoContext).json_time_slots;
	const allUsers = React.useContext(UserInfoContext).allUsers;
	console.log("from schedule", allUsers);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [showMenu, setShowMenu] = useState(false);
	const setCurrentAppointment = useContext(UserInfoContext).setCurrentAppointment;
	const handleContextMenu = (e) => {
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
		return week;
	}

	function get_current_week_dates_only() {
		var curr = get_previous_monday_date(); // get current date
		var week = [];
		for (var i = 0; i < 6; i++) {
			week.push(new Date(curr).toISOString().slice(0, 10));
			curr.setDate(curr.getDate() + 1);
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
					x={menuPosition.x}
					y={menuPosition.y}
					onClose={handleCloseMenu}
				/>
			)}
			<table className="table border-2 bg-white">
				{/* head */}
				<thead>
					<tr>
						<th></th>
						{get_week_from_week_dates(get_current_week_dates()).map((day) => {
							return (
								<th
									key={day}
									className={
										"border w-[13vw] p-2 text-xl text-center" +
										(day === "Today" ? " bg-green-100" : "")
									}
								>
									{day}
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
								{get_current_week_dates_only().map((date) => {
									const current_div_schedule = checkDivInSchedule(
										time_slot,
										date
									);
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
													: "")
											}
											onContextMenu={handleContextMenu}
											onClick={() => {
												if (
													current_div_schedule.taken_appointment !== null
												) {
													setCurrentAppointment({
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
													setCurrentAppointment({
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
import PropTypes from "prop-types";
//  props validation
Schedule.propTypes = {
	// userSchedule: PropTypes.array.isRequired,
};

CustomContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
};
