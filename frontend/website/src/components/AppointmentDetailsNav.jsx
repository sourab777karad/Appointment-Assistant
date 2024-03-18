// this is the drawer. it contains cart. This is present always, and is activated by javascript.
import { useContext, useEffect } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { UserInfoContext } from "../context/UserInfoContext";
import basic_functions from "../utils/basic_functions";
import { BaseUrlContext } from "./../context/BaseUrlContext";

const AppointmentDetailsNav = () => {
	const { userToken, refreshLoggedInUserScheduleForDisplayedWeek, allUsers } =
		useContext(UserInfoContext);
	const base_url = useContext(BaseUrlContext).baseUrl;
	const currentAppointment = useContext(UserInfoContext).currentAppointment;
	useEffect(() => {
		if (!currentAppointment) {
			return;
		}
		console.log("currentAppointment", currentAppointment);
	}, [currentAppointment]);
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
						{currentAppointment && (
							<div className="flex justify-center flex-col p-4 gap-4">
								{/* profile pic and name */}
								<div className="flex w-full justify-between flex-row bg-gray-200 outline-2 rounded-lg my-3 p-4">
									<div className="flex justify-center items-center w-24">
										{currentAppointment?.concerned_party.profile_pic_url
											.length !== 0 ? (
											<img
												src={
													currentAppointment?.concerned_party
														.profile_pic_url
												}
												alt="profile"
												className="w-20 h-20 self-center aspect-square rounded-full outline object-cover object-center"
											/>
										) : (
											<div className="w-20 h-20 flex items-center justify-center text-2xl font-bold text-blue-800">
												{currentAppointment?.concerned_party.full_name
													?.split(" ")
													.map((name) => name[0])
													.join("")}
											</div>
										)}
									</div>
									<div>
										<div className="text-lg">
											{currentAppointment?.concerned_party.full_name}
										</div>
										<div className="text-sm">
											{currentAppointment?.concerned_party.email}
										</div>
										<div className="text-sm">
											{currentAppointment?.concerned_party.room}
										</div>
										<div className="text-sm">
											{currentAppointment?.concerned_party.phone_number}
										</div>
									</div>
								</div>

								{/* Appointment Title */}
								<div className="flex w-full justify-between flex-col gap-4">
									<div className="text-xl">
										Agenda
										<div className="text-lg">{currentAppointment?.title}</div>
									</div>
									<div className="text-xl">
										Description
										<div className="text-lg">
											{currentAppointment?.description}
										</div>
									</div>
								</div>

								{/* Appointment Time */}
								<div className="flex w-full justify-between flex-col gap-4">
									<div className="text-xl">
										Scheduled at:
										<div className="text-lg">
											{currentAppointment?.appointment_date}
											{", "}
											{currentAppointment?.appointment_time}{" "}
										</div>
									</div>
									<div className="text-xl">
										Created at:
										<div className="text-lg">
											{currentAppointment?.creation_date}
											{", "}
											{currentAppointment?.creation_time}
										</div>
									</div>
								</div>

								{/* Appointment Status */}
								<div className="flex w-full justify-between flex-col">
									<div className="text-xl">
										Status
										<div className="text-lg">{currentAppointment?.status}</div>
									</div>
								</div>

								{/* Appointment Status accept, reject buttons depending on status if its pending */}
								{currentAppointment?.type === "Pending Your Confirmation" ? (
									<div className="flex w-full justify-between flex-row gap-4">
										<button
											className="btn bg-green-300 hover:bg-green-400 hover:scale-105 flex-1 text-lg"
											onClick={() => {
												basic_functions.change_status(
													currentAppointment,
													"confirmed",
													base_url,
													userToken,
													refreshLoggedInUserScheduleForDisplayedWeek,
													allUsers,
													"Your appointment has been Confirmed"
												);
											}}
										>
											<IconCheck className="w-6 h-6" />
										</button>
										<button
											className="btn bg-red-300 hover:bg-red-400 hover:scale-105 flex-1 text-lg"
											onClick={() => {
												basic_functions.change_status(
													currentAppointment,
													"cancelled",
													base_url,
													userToken,
													refreshLoggedInUserScheduleForDisplayedWeek,
													allUsers,
													"Your appointment has been Rejected"
												);
											}}
										>
											<IconX className="w-6 h-6" />
										</button>
									</div>
								) : null}

								{currentAppointment?.status === "confirmed" ? (
									<div className="flex w-full justify-between flex-row gap-4">
										<button
											className="btn bg-red-300 hover:bg-red-400 hover:scale-105 flex-1 text-lg"
											onClick={() => {
												basic_functions.change_status(
													currentAppointment,
													"cancelled",
													base_url,
													userToken,
													refreshLoggedInUserScheduleForDisplayedWeek,
													allUsers,
													"Your appointment has been Cancelled"
												);
											}}
										>
											<IconX className="w-6 h-6" />
										</button>
									</div>
								) : null}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppointmentDetailsNav;
