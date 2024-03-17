import Homesvg from "../assets/home.svg";
import "../pages/style.css";
import DayDetailsTable from "./../components/DayDetailsTable";
import { format, parse, isValid } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../context/UserInfoContext";

const Home = () => {
	const [appointments, setAppointments] = useState({});
	const { userSchedule } = useContext(UserInfoContext);

	function getAppointments() {
		const appointments = [];
		console.log(userSchedule);

		// for taken appointments
		for (let i = 0; i < userSchedule?.taken_appointments?.length; i++) {
			const appointmentDate = userSchedule.taken_appointments[i].appointment_date;
			const parsedAppointmentDate = parse(appointmentDate, "yyyy-MM-dd", new Date());
			const today = new Date();
			if (isValid(parsedAppointmentDate) && parsedAppointmentDate >= today) {
				appointments.push(userSchedule.taken_appointments[i]);
			}
		}

		// now same for given apppointments
		for (let i = 0; i < userSchedule?.given_appointments?.length; i++) {
			const appointmentDate = userSchedule.given_appointments[i].appointment_date;
			const parsedAppointmentDate = parse(appointmentDate, "yyyy-MM-dd", new Date());
			const today = new Date();
			if (isValid(parsedAppointmentDate) && parsedAppointmentDate >= today) {
				appointments.push(userSchedule.given_appointments[i]);
			}
		}
		return appointments;
	}
	useEffect(() => {
		const appointments = getAppointments();
		setAppointments(appointments);
	}, []);

	return (
		<div className="mt-24 flex flex-col gap-4">
			{/* first row */}
			<div className="flex flex-row justify-between mx-8 h-full">
				<div className="p-16">
					<div>
						<h2 className="text-7xl font-semibold text-blue-700">
							Welcome to Appointment Assistant
						</h2>
						<div className="text-4xl my-6">
							Effortless scheduling, limitless possibilities!
						</div>
					</div>
				</div>

				<div className="flex justify-center w-full h-full items-start pt-[10vh]">
					<img src={Homesvg} alt="home" className="w-[35vw]" />
				</div>
			</div>

			{/* second row */}
			<div className="flex flex-col justify-center">
				<div className="py-8">
					<div>
						<h2 className="text-5xl font-semibold text-blue-700 text-center mt-16">
							Your Upcoming Appointments
						</h2>
					</div>
				</div>
				<div className="flex justify-center items-center w-full">
					<div className="w-[80vw]">
						<DayDetailsTable appointments={appointments} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
