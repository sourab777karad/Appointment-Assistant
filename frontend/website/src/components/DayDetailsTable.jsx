import React, { useEffect } from "react";

export default function DayDetailsTable({ json_time_slots, user_time_slots, appointments }) {
	useEffect(() => {
		console.log(appointments);
	}, [appointments]);

	return (
		<div>
			<table className="table border-2 bg-white my-8">
				{/* header with day and date */}
				<thead>
					<tr>
						<th>Sr No</th>
						<th>Scheduler</th>
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
									<td>{appointment.scheduler}</td>
									<td>{appointment.agenda}</td>
									<td>{appointment.details}</td>
									<td>{appointment.time_slot}</td>
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
