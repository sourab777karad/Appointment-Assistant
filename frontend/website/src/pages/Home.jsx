import { Link } from "react-router-dom";
import TeacherList from "../components/TeacherList";
import { Button, Input } from "@material-tailwind/react";

import "../pages/style.css";

const Home = () => {
	const appointments = [
		{ time: "9:00 AM", appointee: "John Doe" },
		{ time: "10:00 AM", appointee: "Jane Smith" },
		{ time: "11:00 AM", appointee: "Michael Johnson" },
		{ time: "12:00 PM", appointee: "Emily Davis" },
	];

	return (
		<div className="relative">
			<div className="flex w-full p-auto m-auto h-[100vh] justify-center items-center">
				<div className="ml-12 mt-8 w-[50%] rounded-xl mr-4">
					<TeacherList />
				</div>

				<div className="m-auto p-auto flex justify-center items-center w-[50%]">
					<div className="flex flex-col">
						<Link to="/Appointment-user">
							<Button className="text-lg w-[400px] h-[100px] border-2 border-black bg-green-400 mt-20 rounded-2xl">
								My Appointments
							</Button>
						</Link>
						<Link to="/Appointment-past">
							<Button className="text-lg w-[400px] h-[100px] border-2 border-black bg-red-400 mt-8 rounded-2xl">
								Previous Appointments
							</Button>
						</Link>
					</div>
				</div>
			</div>

			<div className="flex relative w-[100%] h-[100vh] mt-2 ">
				<div className="m-auto p-auto  flex flex-col items-center justify-center">
					<h2 className="text-[48px] mb-12">Your Appointments</h2>

					<table className="neumorphic w-[80%]">
						<thead>
							<tr>
								<th className="text-lg">Time</th>
								<th className="text-lg">Appointee</th>
							</tr>
						</thead>
						<tbody>
							{appointments.map((appointment, index) => (
								<tr key={index}>
									<td>{appointment.time}</td>
									<td>{appointment.appointee}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Home;
