import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button, Input } from "@material-tailwind/react";

export default function NewAppointment() {
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedTime, setSelectedTime] = useState("");
	const [selectedDate, setSelectedDate] = useState("");
	const [topic, setTopic] = useState("");
	const [errors, setErrors] = useState({});

	const handleSubmit = (e) => {
		e.preventDefault();

		let errors = {};
		if (!selectedTeacher) {
			errors.teacher = "Please select a teacher";
		}
		if (!selectedTime) {
			errors.time = "Please select a time";
		}
		if (!selectedDate) {
			errors.date = "Please select a date";
		}
		if (!topic) {
			errors.topic = "Please enter a topic";
		}

		setErrors(errors);

		if (Object.keys(errors).length === 0) {
			console.log("Form submitted successfully!");
			toast.success("Appointment Request Sent Successfully", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	};

	const teacherNames = [
		"Teacher 1",
		"Teacher 2",
		"Teacher 3",
		"Teacher 4",
		"Teacher 5",
		"Teacher 6",
		"Teacher 7",
	];
	return (
		<div className="pt-24">
			<h1 className="text-3xl font-bold my-4 text-center">
				Make New Appointment
			</h1>

			<div className="flex flex-col items-center justify-center mt-12">
				<div className="p-6 border border-gray-300 rounded-lg w-[800px]">
					<form onSubmit={handleSubmit}>
						<div className="mb-8">
							<label className="block text-lg font-medium text-gray-700">
								Select Teacher:
							</label>
							<select
								className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 ${
									errors.teacher && "border-red-500"
								}`}
								value={selectedTeacher}
								onChange={(e) =>
									setSelectedTeacher(e.target.value)
								}
							>
								<option value="">Select a teacher</option>
								{teacherNames.map((teacher, index) => (
									<option key={index} value={teacher}>
										{teacher}
									</option>
								))}
							</select>
							{errors.teacher && (
								<p className="text-red-500 mt-1">
									{errors.teacher}
								</p>
							)}
						</div>
						<div className="mb-6">
							<label className="block text-lg font-medium text-gray-700">
								Select Time:
							</label>
							<select
								className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 ${
									errors.time && "border-red-500"
								}`}
								value={selectedTime}
								onChange={(e) =>
									setSelectedTime(e.target.value)
								}
							>
								<option value="">Select a time slot</option>
								<option value="3pm-4pm">3pm - 4pm</option>
								<option value="5pm-6pm">5pm - 6pm</option>
							</select>
							{errors.time && (
								<p className="text-red-500 mt-1">
									{errors.time}
								</p>
							)}
						</div>
						<div className="mb-6">
							<label className="block text-lg font-medium text-gray-700">
								Select Date:
							</label>
							<Input
								type="date"
								className={`mt-1 block w-full ${
									errors.date && "border-red-500"
								}`}
								value={selectedDate}
								onChange={(e) =>
									setSelectedDate(e.target.value)
								}
							/>
							{errors.date && (
								<p className="text-red-500 mt-1">
									{errors.date}
								</p>
							)}
						</div>
						<div className="mb-6">
							<label className="block text-lg font-medium text-gray-700">
								Add Topic:
							</label>
							<Input
								type="text"
								className={`mt-1 block w-full ${
									errors.topic && "border-red-500"
								}`}
								value={topic}
								onChange={(e) => setTopic(e.target.value)}
							/>
							{errors.topic && (
								<p className="text-red-500 mt-1">
									{errors.topic}
								</p>
							)}
						</div>
						<Button
							size="xl"
							type="submit"
							className="rounded-lg w-full"
						>
							Make Appointment
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
