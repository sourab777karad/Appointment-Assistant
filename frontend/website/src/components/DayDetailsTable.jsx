import { useEffect, useContext } from "react";
import { UserInfoContext } from "../context/UserInfoContext";

export default function DayDetailsTable({ json_time_slots, user_time_slots, appointments }) {
	const { allUsers } = useContext(UserInfoContext);
	useEffect(() => {
		console.log(appointments);
	}, [appointments]);

	function get_names_from_appointment(appointment) {
		if (appointment === null) {
			return null;
		}
		// find the user.firebase_id in allUsers matching with appointment.scheduler and apppointment.appointee
		let appointee = {};
		allUsers.forEach((user) => {
			if (user.firebase_id === appointment.appointee) {
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
					{Array.isArray(appointments) &&
						appointments.map((appointment, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{get_names_from_appointment(appointment).full_name}</td>
									<td>{appointment.title}</td>
									<td>{appointment.description}</td>
									<td>
										{appointment.appointment_time} -{" "}
										{appointment.appointment_time + appointment.duration}
									</td>
									<td className="flex justify-center items-center min-w-40">
										<textarea
											className="textarea textarea-bordered textarea-sm text-sm w-full"
											placeholder="Minutes of This Meeting"
										></textarea>
									</td>
									<td>
										<button
											className="btn btn-sm text-white px-4 py-2 rounded-md bg-green-300"
											onClick={() => {
												console.log("Mark as Done");
											}}
										>
											Mark as Done
										</button>
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
}