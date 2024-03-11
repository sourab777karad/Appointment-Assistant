import React from "react";
import { useState, useContext } from "react";
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
						<a>Show Details</a>
					</li>
					<li>
						<a>Cancel Appointment</a>
					</li>
					<li>
						<a>Item 3</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default function Schedule({ userSchedule }) {
	const user_time_slots = React.useContext(UserInfoContext).time_slots;

	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [showMenu, setShowMenu] = useState(false);
	const setCurrentAppointment = useContext(UserInfoContext).setCurrentAppointment;
	const handleContextMenu = (e) => {
		e.preventDefault(); // Prevent default right-click menu
		setMenuPosition({ x: e.clientX, y: e.clientY });
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
		const taken_appointments = [];
		const given_appointments = [];

		// look through the userSchedule.taken_appointments to find the appointment with date matching date, and if its time is present in the time_slot
		userSchedule.taken_appointments.forEach((appointment) => {
			if (appointment.date === date) {
				// check if appointment.appointment_datetime is present in the the times of the time_slot
				
			}
		});
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
										"border-2 w-[13vw] p-2" +
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
					{user_time_slots.map((time_slot) => {
						return (
							<tr key={time_slot}>
								<td className="border-2 p-2">{time_slot}</td>
								{get_current_week_dates().map((date) => {
									return (
										<td
											key={date}
											className="border p-2"
											onContextMenu={handleContextMenu}
											onClick={() => {
												// check if the current date and time are present in the userschedule
												const appointment = checkDivInSchedule(
													time_slot,
													date
												);
												setCurrentAppointment(appointment);
												document.getElementById(
													"appointment-drawer"
												).checked = true;
												// close the menu
												handleCloseMenu();
											}}
										>
											{/* here you can put the appointment details */}
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
	userSchedule: PropTypes.array.isRequired,
};

CustomContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
};
