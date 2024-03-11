// this is the drawer. it contains cart. This is present always, and is activated by javascript.

import { useNavigate } from "react-router-dom";
import { IconCheck, IconX } from "@tabler/icons-react";
import React from "react";
import { UserInfoContext } from "../context/UserInfoContext";

const integerToTime = (integer) => {
	// Convert integer to string and pad with leading zeros if necessary
	const timeString = String(integer).padStart(4, "0");

	// Extract hours and minutes from the time string
	const hours = timeString.slice(0, 2);
	const minutes = timeString.slice(2);

	// Create a Date object with the extracted hours and minutes
	const date = new Date();
	date.setHours(hours);
	date.setMinutes(minutes);

	// Format the Date object as a time string (12-hour format with AM/PM)
	const formattedTime = date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});

	return formattedTime;
};

const SideNav = () => {
	const navigate = useNavigate();
	const given_appointments = React.useContext(UserInfoContext).userSchedule?.given_appointments;
	const allUsers = React.useContext(UserInfoContext).allUsers;
	const userDetails = React.useContext(UserInfoContext).userDetails;
	const user_id = userDetails?.firebase_id;

	function get_name_from_appointment(appointment) {
		if (appointment === null) {
			return null;
		}
		// iterate through the allUsers array to find the user with the given firebase_id as appointment.scheduler
		const scheduler = allUsers.find((user) => user.firebase_id === appointment.scheduler);
		return scheduler;
	}

	return (
		<div>
			<div className="drawer drawer-end z-50">
				<input id="notif-drawer" type="checkbox" className="drawer-toggle hidden" />
				<div className="drawer-side">
					<label
						htmlFor="notif-drawer"
						aria-label="close sidebar"
						className="drawer-overlay"
					></label>
					<div className="w-[23vw] min-h-full bg-gray-100 text-base-content drawer-content border-l-2 border-black">
						<div className="bg-gray-200 m-4 rounded-lg outline-2 mr-6">
							<div className="w-full flex justify-between p-4">
								<div className="text-xl">Notifications</div>
								<IconX
									className="w-8 h-8 cursor-pointer"
									onClick={() => {
										document.getElementById("notif-drawer").checked = false;
									}}
								/>
							</div>
						</div>
						<div className="flex justify-center"></div>

						<div>
							{given_appointments?.map((appointment, index) => {
								return (
									<div
										key={index}
										className="flex justify-center items-center gap-5 p-4 flex-col"
									>
										{appointment.status === "pending" ? (
											<div className="flex flex-col gap-2 bg-gray-300 p-2 rounded-lg">
												<div className="p-2">
													{
														get_name_from_appointment(appointment)
															.full_name
													}{" "}
													has requested an appointment at{" "}
													{integerToTime(appointment.appointment_time)} on{" "}
													{new Date(
														appointment.appointment_date
													).toDateString()}
												</div>
												<div className="flex w-full justify-between flex-row gap-4 p-2">
													<button className="btn bg-green-300 hover:bg-green-400 hover:scale-105 flex-1 text-lg">
														<IconCheck className="w-6 h-6" />
													</button>
													<button className="btn bg-red-300 hover:bg-red-400 hover:scale-105 flex-1 text-lg">
														<IconX className="w-6 h-6" />
													</button>
												</div>
											</div>
										) : null}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideNav;
