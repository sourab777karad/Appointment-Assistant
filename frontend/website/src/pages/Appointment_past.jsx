import React, { useState } from "react";
import YearScroll from "../components/YearScroll";
import NotFound from "../assets/notfound.svg";
const Appointment_past = () => {
  const pastAppointments = [
    {
      title: "Dentist Appointment",
      month: "December",
      year: 2023,
      date: 15,
      time: "10:00 AM",
      description: "Regular checkup",
    },
    {
      title: "Meeting with Client",
      month: "November",
      year: 2023,
      date: 28,
      time: "2:30 PM",
      description: "Discuss project details",
    },
    {
      title: "Job Interview",
      month: "October",
      year: 2023,
      date: 20,
      time: "11:00 AM",
      description: "Interview for software engineer position",
    },
    {
      title: "Doctor's Appointment",
      month: "September",
      year: 2023,
      date: 5,
      time: "9:15 AM",
      description: "Follow-up on medication",
    },
    // 2024 appointments
    // January
    {
      title: "Annual Physical Exam",
      month: "January",
      year: 2024,
      date: 10,
      time: "8:30 AM",
      description: "Routine health check-up",
    },
    {
      title: "Team Meeting",
      month: "January",
      year: 2024,
      date: 15,
      time: "10:00 AM",
      description: "Discuss project progress",
    },
    {
      title: "Training Workshop",
      month: "January",
      year: 2024,
      date: 25,
      time: "1:00 PM",
      description: "Employee skill development",
    },
    // February
    {
      title: "Project Kickoff",
      month: "February",
      year: 2024,
      date: 5,
      time: "9:00 AM",
      description: "Start of new project",
    },
    {
      title: "Monthly Review",
      month: "February",
      year: 2024,
      date: 15,
      time: "3:30 PM",
      description: "Review performance and goals",
    },
    // March
    {
      title: "Client Presentation",
      month: "March",
      year: 2024,
      date: 8,
      time: "11:00 AM",
      description: "Present project updates to client",
    },
    {
      title: "Training Session",
      month: "April",
      year: 2024,
      date: 18,
      time: "2:00 PM",
      description: "New software training",
    },
    {
      title: "Training Session",
      month: "April",
      year: 2024,
      date: 18,
      time: "2:00 PM",
      description: "New software training",
    },
    {
      title: "Training Session",
      month: "April",
      year: 2024,
      date: 18,
      time: "2:00 PM",
      description: "New software training",
    },
    {
      title: "Training Session",
      month: "April",
      year: 2024,
      date: 18,
      time: "2:00 PM",
      description: "New software training",
    },
    {
      title: "Training Session",
      month: "April",
      year: 2024,
      date: 18,
      time: "2:00 PM",
      description: "New software training",
    },
    {
      title: "Board Meeting",
      month: "March",
      year: 2024,
      date: 25,
      time: "9:30 AM",
      description: "Monthly board meeting",
    },
    // April
    {
      title: "Team Building Activity",
      month: "April",
      year: 2024,
      date: 10,
      time: "10:00 AM",
      description: "Promote team bonding",
    },
    {
      title: "Product Launch",
      month: "April",
      year: 2024,
      date: 22,
      time: "1:00 PM",
      description: "Launch new product line",
    },
    {
      title: "Training Workshop",
      month: "April",
      year: 2024,
      date: 28,
      time: "9:00 AM",
      description: "Employee skill development",
    },
  ];

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

  const getAppointmentsForSelectedMonth = () => {
    if (!selectedYear || !selectedMonth) return [];
    const filteredAppointments = pastAppointments.filter(
      (appointment) =>
        appointment.year === selectedYear && appointment.month === selectedMonth
    );
    return filteredAppointments;
  };

  return (
    <div className="mx-auto px-4 pt-24 mb-[200px]">
      <h1 className="text-3xl font-semibold my-4 text-center text-blue-700">
        Past Appointments
      </h1>
      <YearScroll onSelectYear={handleYearSelect} />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].map((month, index) => (
          <div
            key={index}
            className={`cursor-pointer bg-white rounded-lg shadow-md p-16 text-center ${
              selectedMonth === month ? "bg-[#E0F6FF]" : ""
            }`}
            onClick={() => handleMonthSelect(month)}
          >
            {month}
          </div>
        ))}
      </div>
      {selectedMonth && selectedYear && (
        <div>
          <h2 className="ml-6 text-2xl font-bold mb-12 mt-12">
            {selectedMonth} {selectedYear}
          </h2>
          <div className="grid grid-cols-1 md:flex gap-4 flex-wrap ml-12">
            {getAppointmentsForSelectedMonth().length > 0 ? (
              getAppointmentsForSelectedMonth().map((appointment, index) => (
                <div
                  key={index}
                  className="rounded-lg shadow-md bg-[#E0F6FF] w-[200px] h-[200px] m-2 p-4 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-lg font-bold mb-2">
                      {appointment.title}
                    </h2>
                    <p className="text-gray-600 mb-2">
                      {appointment.date} {appointment.month}, {appointment.year}
                    </p>
                    <p className="text-gray-600 mb-2">{appointment.time}</p>
                    <p className="text-gray-600">{appointment.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className=" w-[100%] h-[400px] m-2 flex justify-center items-center">
                <img
                  src={NotFound}
                  alt="No appointments found"
                  className=" rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment_past;
