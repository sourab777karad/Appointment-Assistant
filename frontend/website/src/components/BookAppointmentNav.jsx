// this is the drawer. it contains cart. This is present always, and is activated by javascript.
import { useContext, useEffect } from "react";
import { useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { UserInfoContext } from "../context/UserInfoContext";
import { BaseUrlContext } from "../context/BaseUrlContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, parse } from "date-fns";

const BookAppointmentNav = () => {
	const {
		userToken,
		userDetails,
		newAppointmentTime,
		newAppointmentDate,
		newAppointeeId,
		update_did_book_new_appointment,
		refreshLoggedInUserScheduleForDisplayedWeek,
	} = useContext(UserInfoContext);
	const base_url = useContext(BaseUrlContext).baseUrl;
	const [title, setTitle] = useState(null);
	const [description, setDescription] = useState(null);

	useEffect(() => {
		console.log("appdatetime", newAppointmentDate, newAppointmentTime);
	}, [newAppointmentDate, newAppointmentTime]);

	// function to book appointment
	function book_appointment() {
		console.log("booking new appointment", newAppointmentTime);
		const res = axios
			.post(
				`${base_url}/book-appointment`,
				{
					scheduler_id: userDetails.firebase_id,
					appointee_id: newAppointeeId,
					appointment_time: newAppointmentTime.start_time,
					appointment_end_time: newAppointmentTime.end_time,
					appointment_date: newAppointmentDate,
					creation_time: format(new Date(), "h:mm a"),
					creation_date: format(new Date(), "yyyy-MM-dd"),
					title: title,
					description: description,
					duration: userDetails.appointment_duration,
					cancellation_message: "",
					status: "pending",
					minutes_of_meeting: "",
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			)
			.then((response) => {
				console.log(response.data);
				update_did_book_new_appointment();
				refreshLoggedInUserScheduleForDisplayedWeek();
			})
			.catch((error) => {
				console.log(error);
			});

		toast.promise(res, {
			loading: "Loading",
			success: "Appointment Requested successfully",
			error: "Error booking appointment",
		});
	}

	function get_full_date(date) {
		if (!date) {
			return null;
		}
		// date is in format yyyy-MM-dd
		// use date-fns
		// required format is a string in the format "Monday, 1st January, 2022"
		const date_obj = parse(date, "yyyy-MM-dd", new Date());
		const full_date = format(date_obj, "EEEE, do MMMM, yyyy");
		return full_date;
	}
	return (
		<div className="roboto-regular text-black">
			<div className="drawer drawer-start z-50">
				<input id="book-drawer" type="checkbox" className="drawer-toggle hidden" />
				{/* <label
          id="cartlabel"
          htmlFor="appointment-drawer"
          className="btn btn-primary drawer-button"
        >
          Open drawer
        </label> */}
				<div className="drawer-side">
					<label
						htmlFor="book-drawer"
						aria-label="close sidebar"
						className="drawer-overlay"
					></label>
					<div className="w-[25vw] min-h-full bg-white text-base-content drawer-content border-r-2 border-black">
						<div className="bg-gray-200 m-4 rounded-lg outline-2">
							<div className="w-full flex justify-between p-4">
								<div className="text-xl">Book Appointment</div>
								<IconX
									className="w-6 h-6 cursor-pointer"
									onClick={() => {
										document.getElementById("book-drawer").checked = false;
									}}
								/>
							</div>
						</div>
						<div className="flex justify-center flex-col p-4 gap-4">
							{/* Appointment Title */}
							<div className="flex w-full justify-between flex-col gap-4">
								<div className="text-xl">Agenda</div>
								<input
									type="text"
									placeholder="Enter the title of the appointment"
									value={title}
									className="border-2 rounded-md p-2"
									onChange={(e) => setTitle(e.target.value)}
								/>
								<div className="text-xl">Description</div>
								<textarea
									placeholder="Enter the description of the appointment"
									value={description}
									className="border-2 rounded-md p-2"
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>

							{/* Appointment Time */}
							<div className="flex w-full justify-between flex-col gap-4">
								<div className="text-xl">
									To Be Scheduled at:
									<div className="text-lg">
										{newAppointmentTime?.start_time} on{" "}
										{get_full_date(newAppointmentDate)}
									</div>
								</div>
							</div>

							{/* Appointment Actions */}
							<div className="flex w-full justify-between">
								<div
									className="btn bg-green-300 w-1/2 p-2 rounded-md flex justify-center items-center gap-2 cursor-pointer hover:bg-green-400 transition-all hover:scale-105 duration-200"
									onClick={() => {
										book_appointment();
										document.getElementById("book-drawer").checked = false;
									}}
								>
									<IconCheck className="w-6 h-6" />
									Book Appointment
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookAppointmentNav;
