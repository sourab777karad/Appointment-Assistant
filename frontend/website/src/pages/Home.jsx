import { Link } from "react-router-dom";
import Carousel from "../components/MyCarousel";
import { Button, Input } from "@material-tailwind/react";
import { useState } from "react"; // Import useState hook
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify stylesheet
import "../pages/style.css";

const Home = () => {
  // Sample teacher names, you can replace them with your data
  const teacherNames = [
    "Teacher 1",
    "Teacher 2",
    "Teacher 3",
    "Teacher 4",
    "Teacher 5",
  ];

  // State variables for form inputs and errors
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState({});

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation rules
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

    // Set errors state
    setErrors(errors);

    // If no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      // Your form submission logic here
      console.log("Form submitted successfully!");
      // Show notification
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
    <div className="relative">
      <ToastContainer />
      <h2 className="text-2xl flex text-[48px] mt-12 mb-8 font-bold  items-center justify-center">
        Make an Appointment
      </h2>
      <div className="flex flex-col items-center justify-center ">
        {/* Form for making appointments */}
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
                {/* Add more time slot options as needed */}
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

      {/* Remaining content */}
      <div className="flex w-full p-auto m-auto items-center">
        <div className="ml-12 mt-24 w-[40%] h-[40%] rounded-xl mr-4">
          <Carousel />
        </div>

        <div className="m-auto p-auto flex justify-center w-[50%]">
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

      <div className="flex relative w-[90vw] h-[100vh] mt-2 m-auto p-auto">
        <div className="m-auto p-auto items-center">
          <table className="neumorphic">
            <thead>
              <tr>
                <th className="text-lg">Time</th>
                <th className="text-lg">Appointee</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
