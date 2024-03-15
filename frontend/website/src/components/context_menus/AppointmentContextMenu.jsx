const AppointmentContextMenu = ({
	x,
	y,
	onClose,
	appointment,
	change_status,
	block_appointment,
	blockPrivileges,
}) => {
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
					{appointment ? (
						<li
							onClick={() => {
								change_status(appointment.start_time, "confirmed");
							}}
						>
							<a>Cancel Appointment</a>
						</li>
					) : null}
					{blockPrivileges && (
						<li
							onClick={() => {
								console.log(appointment, "clicked");
								block_appointment(appointment.start_time);
							}}
						>
							<a>Block Time Slot</a>
						</li>
					)}
					{!blockPrivileges && (
						<li>
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

AppointmentContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.object.isRequired,
	change_status: PropTypes.func.isRequired,
};
