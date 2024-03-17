import { useEffect, useContext } from "react";
import { UserInfoContext } from "../context/UserInfoContext";
import NoAppsvg from "../assets/no_appointments.svg";
import { format, parse } from "date-fns";
import { IconCheck } from "@tabler/icons-react";

export default function DayDetailsTable({ json_time_slots, user_time_slots, appointments }) {
	const { allUsers } = useContext(UserInfoContext);
	useEffect(() => {
		console.log(appointments);
	}, [appointments]);

	// function to add duration to time
	function add_duration(time, duration) {
		console.log(time, duration);
		const time_obj = parse(time, "h:mm a", new Date());
		const new_time = format(new Date(time_obj.getTime() + duration * 60000), "HH:mm");
		return new_time;
	}

	function get_names_from_appointment(appointment) {
		if (appointment === null) {
			return null;
		}
		// find the user.firebase_id in allUsers matching with appointment.scheduler and apppointment.appointee
		let appointee = {};
		allUsers.forEach((user) => {
			if (user.firebase_id === appointment.appointee_id) {
				appointee.full_name = user.full_name;
				appointee.email = user.email;
				appointee.room = user.room;
				appointee.profile_pic_url = user.profile_pic_url;
				appointee.phone_number = user.phone_number;
			}
		});
		return appointee;
	}

	return (
		<div>
			{Array.isArray(appointments) && appointments.length > 0 && (
				<table className="table border-2 bg-white my-8">
					{/* header with day and date */}
					<thead>
						<tr>
							<th>Sr No</th>
							<th>Meeting with</th>
							<th>Agenda</th>
							<th>Details</th>
							<th>Time Slot</th>
							<th>Minutes</th>
							<th>Done?</th>
						</tr>
					</thead>
					{/* body with time slots */}
					<tbody>
						{appointments.map((appointment, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{get_names_from_appointment(appointment).full_name}</td>
									<td>{appointment.title}</td>
									<td>{appointment.description}</td>
									<td>
										{appointment.appointment_time} to{" "}
										{appointment.appointment_end_time}
									</td>
									<td className="flex justify-center items-center min-w-40">
										{appointment.minutes_of_meeting !== "" ? (
											<textarea
												className="textarea textarea-bordered textarea-sm text-sm w-full"
												placeholder="Minutes of This Meeting"
											></textarea>
										) : (
											<div>{appointment.minutes_of_meeting}</div>
										)}
									</td>
									<td>
										<button
											className="btn text-white rounded-md bg-green-300 flex justify-center items-center gap-2 cursor-pointer hover:bg-green-400 transition-all hover:scale-105 duration-200"
											onClick={() => {
												console.log("Mark as Done");
											}}
										>
											<IconCheck className="w-6 h-6" />
											Mark as Completed
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
			{
				// if there are no appointments
				!appointments.length && (
					<div className="text-center text-2xl text-gray-500 mt-8 flex flex-col gap-4">
						<img src={NoAppsvg} alt="no appointments" className="w-[20vw] mx-auto" />
						<div className="mt-4">No appointments scheduled for this day</div>
					</div>
				)
			}
		</div>
	);
}
