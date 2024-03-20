import { useContext, useEffect } from "react";
import { UserInfoContext } from "../../context/UserInfoContext";
import { BaseUrlContext } from "../../context/BaseUrlContext";

const AppointmentContextMenu = ({ x, y, onClose, appointment, change_status, blockPrivileges }) => {
	const handleClick = (e) => {
		e.preventDefault(); // Prevent default right-click menu
		onClose(); // Close custom menu
	};
	const {
		setNewAppointmentDate,
		setNewAppointmentTime,
		userSchedule,
		refreshLoggedInUserScheduleForDisplayedWeek,
		userToken,
		userDetails,
	} = useContext(UserInfoContext);

	const base_url = useContext(BaseUrlContext).baseUrl;

	useEffect(() => {
		console.log(userSchedule);
		console.log("app", appointment);
	}, [userSchedule]);

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
					{blockPrivileges && appointment.type !== "blocked" && (
						<li
							onClick={() => {
								console.log(appointment, "clicked");
								basic_functions.block_appointment(
									appointment,
									base_url,
									userToken,
									userDetails,
									refreshLoggedInUserScheduleForDisplayedWeek
								);
							}}
						>
							<a>Block Time Slot</a>
						</li>
					)}
					{blockPrivileges && (
						<li
							onClick={() => {
								console.log(appointment, "clicked");
								basic_functions.unblock_appointment(
									appointment,
									base_url,
									userToken,
									userDetails,
									refreshLoggedInUserScheduleForDisplayedWeek
								);
							}}
						>
							<a>Un-Block Time Slot</a>
						</li>
					)}
					{!blockPrivileges && (
						<li
							onClick={() => {
								console.log(appointment, "clicked");
								setNewAppointmentDate(appointment.appointment_date);
								setNewAppointmentTime({
									start_time: appointment.start_time,
									end_time: appointment.end_time,
								});
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
import basic_functions from "../../utils/basic_functions";

AppointmentContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.object.isRequired,
	change_status: PropTypes.func.isRequired,
	block_appointment: PropTypes.func.isRequired,
	unblock_appointment: PropTypes.func.isRequired,
	blockPrivileges: PropTypes.bool.isRequired,
};
