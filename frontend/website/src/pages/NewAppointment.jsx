import { useState } from "react";
import { toast } from "react-hot-toast";
import Schedule from "../components/Schedule";
import { UserInfoContext } from "../context/UserInfoContext";

export default function NewAppointment() {
	const [appointeeSchedule, setAppointeeSchedule] = useState({
		taken_appointments: [],
		given_appointments: [],
	});
	const [currentWeek, setCurrentWeek] = useState({
		start_date: new Date().toISOString().slice(0, 10),
		end_date: new Date().toISOString().slice(0, 10),
	});


	return (
		<div className="pt-24">
			<div>
				<div>
					<h1 className="text-3xl font-semibold text-center mt-4 text-blue-800">
						Make New Appointment
					</h1>
				</div>
			</div>
			<Schedule
				userSchedule={appointeeSchedule}
				currentWeek={currentWeek}
				handleNextWeekChanged={handleNextWeekChanged}
				handlePreviousWeekChanged={handlePreviousWeekChanged}				
			/>
		</div>
	);
}
