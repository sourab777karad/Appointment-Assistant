import { Link } from "react-router-dom";
import TeacherList from "../components/TeacherList";
import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../pages/style.css";

const Home = () => {
  const teacherNames = [
    "Teacher 1",
    "Teacher 2",
    "Teacher 3",
    "Teacher 4",
    "Teacher 5",
  ];

  const appointments = [
    { time: "9:00 AM", appointee: "John Doe" },
    { time: "10:00 AM", appointee: "Jane Smith" },
    { time: "11:00 AM", appointee: "Michael Johnson" },
    { time: "12:00 PM", appointee: "Emily Davis" },
  ];

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

  return (
    <div className="relative mt-32">
      <ToastContainer />
      <h2 className="text-2xl flex text-[48px] mt-12 mb-8 font-bold items-center justify-center">
        Make an Appointment
      </h2>
      <div className="flex flex-col items-center justify-center ">
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
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="">Select a teacher</option>
                {teacherNames.map((teacher, index) => (
                  <option key={index} value={teacher}>
                    {teacher}
                  </option>
                ))}
              </select>
              {errors.teacher && (
                <p className="text-red-500 mt-1">{errors.teacher}</p>
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
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Select a time slot</option>
                <option value="3pm-4pm">3pm - 4pm</option>
                <option value="5pm-6pm">5pm - 6pm</option>
              </select>
              {errors.time && (
                <p className="text-red-500 mt-1">{errors.time}</p>
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
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {errors.date && (
                <p className="text-red-500 mt-1">{errors.date}</p>
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
                <p className="text-red-500 mt-1">{errors.topic}</p>
              )}
            </div>
            <Button size="xl" type="submit" className="rounded-lg w-full">
              Make Appointment
            </Button>
          </form>
        </div>
      </div>

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
