import { useContext } from "react";
import { UserInfoContext } from "../../context/UserInfoContext";

const AppointmentContextMenu = ({
	x,
	y,
	onClose,
	appointment,
	change_status,
	block_appointment,
	unblock_appointment,
	blockPrivileges,
}) => {
	const handleClick = (e) => {
		e.preventDefault(); // Prevent default right-click menu
		onClose(); // Close custom menu
	};
	const { setNewAppointmentDate, setNewAppointmentTime, userSchedule } =
		useContext(UserInfoContext);

	function check_if_appointment_is_blocked(appointment) {
		console.log(appointment, userSchedule)
		// iterate through all blocked appointments in userschedule
		for (let i = 0; i < userSchedule.blocked_appointments.length; i++) {
			if (userSchedule.blocked_appointments[i].start_time === appointment[0].start_time) {
				return true;
			}
		}
		return false;
	}

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
					{appointment.status === "confirmed" ? (
						<li
							onClick={() => {
								change_status(appointment.start_time, "confirmed");
							}}
						>
							<a>Cancel Appointment</a>
						</li>
					) : null}
					{blockPrivileges && !check_if_appointment_is_blocked(appointment) && (
						<li
							onClick={() => {
								console.log(appointment, "clicked");
								block_appointment(appointment);
							}}
						>
							<a>Block Time Slot</a>
						</li>
					)}
					{blockPrivileges && (
						<li
							onClick={() => {
								console.log(appointment, "clicked");
								unblock_appointment(appointment);
							}}
						>
							<a>Un-Block Time Slot</a>
						</li>
					)}
					{!blockPrivileges && (
						<li
							onClick={() => {
								console.log(appointment, "clicked");
								setNewAppointmentDate(appointment[0].appointment_date);
								setNewAppointmentTime(appointment[0].start_time);
								// open the book appointment nav
								document.getElementById(
									"book-drawer"
									// "appointment-drawer"
								).checked = true;
							}}
						>
							<a>Book Appointment</a>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
};

export default AppointmentContextMenu;

import PropTypes from "prop-types";
import UserSchedule from "./../../pages/UserSchedule";

AppointmentContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.object.isRequired,
	change_status: PropTypes.func.isRequired,
};
