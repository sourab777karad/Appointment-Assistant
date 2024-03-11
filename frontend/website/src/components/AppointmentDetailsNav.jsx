// this is the drawer. it contains cart. This is present always, and is activated by javascript.
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconCheck, IconX } from "@tabler/icons-react";
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

const AppointmentDetailsNav = () => {
	const currentAppointment = useContext(UserInfoContext).currentAppointment;
	useEffect(() => {
		console.log("currentAppointment", currentAppointment);
	}, [currentAppointment]);
	const navigate = useNavigate();
	return (
		<div className="roboto-regular text-black">
			<div className="drawer drawer-start z-50">
				<input id="appointment-drawer" type="checkbox" className="drawer-toggle hidden" />
				{/* <label
          id="cartlabel"
          htmlFor="appointment-drawer"
          className="btn btn-primary drawer-button"
        >
          Open drawer
        </label> */}
				<div className="drawer-side">
					<label
						htmlFor="appointment-drawer"
						aria-label="close sidebar"
						className="drawer-overlay"
					></label>
					<div className="w-[25vw] min-h-full bg-white text-base-content drawer-content border-r-2 border-black">
						<div className="bg-gray-200 m-4 rounded-lg outline-2">
							<div className="w-full flex justify-between p-4">
								<div className="text-xl">Appointment Details</div>
								<IconX
									className="w-6 h-6 cursor-pointer"
									onClick={() => {
										document.getElementById("appointment-drawer").checked =
											false;
									}}
								/>
							</div>
						</div>
						<div className="flex justify-center flex-col p-4 gap-4">
							{/* profile pic and name */}
							<div className="flex w-full justify-between flex-row bg-gray-200 outline-2 rounded-lg my-3 p-4">
								<div className="flex justify-center items-center w-24">
									<img
										src={currentAppointment?.person.profile_pic_url}
										alt="profile"
										className="w-20 h-20 self-center aspect-square rounded-full outline object-cover object-center"
									/>
								</div>
								<div>
									<div className="text-lg">
										{currentAppointment?.person.full_name}
									</div>
									<div className="text-sm">
										{currentAppointment?.person.email}
									</div>
									<div className="text-sm">{currentAppointment?.person.room}</div>
									<div className="text-sm">
										{currentAppointment?.person.phone_number}
									</div>
								</div>
							</div>

							{/* Appointment Title */}
							<div className="flex w-full justify-between flex-col gap-4">
								<div className="text-xl">
									Agenda
									<div className="text-lg">
										{currentAppointment?.appointment.title}
									</div>
								</div>
								<div className="text-xl">
									Description
									<div className="text-lg">
										{currentAppointment?.appointment.description}
									</div>
								</div>
							</div>

							{/* Appointment Time */}
							<div className="flex w-full justify-between flex-col gap-4">
								<div className="text-xl">
									Scheduled at:
									<div className="text-lg">
										{currentAppointment?.appointment.appointment_date}
										{", "}
										{integerToTime(
											currentAppointment?.appointment.appointment_time
										)}{" "}
									</div>
								</div>
								<div className="text-xl">
									Created at:
									<div className="text-lg">
										{currentAppointment?.appointment.creation_date}
										{", "}
										{integerToTime(
											currentAppointment?.appointment.creation_time
										)}
									</div>
								</div>
							</div>

							{/* Appointment Status */}
							<div className="flex w-full justify-between flex-col">
								<div className="text-xl">
									Status
									<div className="text-lg">
										{currentAppointment?.appointment.status}
									</div>
								</div>
							</div>

							{/* Appointment Status accept or reject buttons depending on status if its pending. */}
							{currentAppointment?.appointment.status === "pending" ? (
								<div className="flex w-full justify-between flex-row gap-4">
									<button className="btn bg-green-300 hover:bg-green-400 hover:scale-105 flex-1 text-lg">
										<IconCheck className="w-6 h-6" />
									</button>
									<button className="btn bg-red-300 hover:bg-red-400 hover:scale-105 flex-1 text-lg">
										<IconX className="w-6 h-6" />
									</button>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppointmentDetailsNav;
