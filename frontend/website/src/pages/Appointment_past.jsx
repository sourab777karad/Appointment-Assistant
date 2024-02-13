import React, { useState } from "react";

const Appointment_past = ({}) => {
  const pastAppointments = [
    {
      title: "Dentist Appointment",
      date: "2023-12-15",
      time: "10:00 AM",
      description: "Regular checkup",
    },
    {
      title: "Meeting with Client",
      date: "2023-11-28",
      time: "2:30 PM",
      description: "Discuss project details",
    },
    {
      title: "Job Interview",
      date: "2023-10-20",
      time: "11:00 AM",
      description: "Interview for software engineer position",
    },
    {
      title: "Doctor's Appointment",
      date: "2023-09-05",
      time: "9:15 AM",
      description: "Follow-up on medication",
    },
    // Add more past appointments here
  ];

  const [selectedMonth, setSelectedMonth] = useState(null);

  // Function to handle month selection
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Past Appointments</h1>
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
            className={`cursor-pointer bg-white rounded-lg shadow-md p-4 text-center ${
              selectedMonth === month ? "bg-blue-200" : ""
            }`}
            onClick={() => handleMonthSelect(month)}
          >
            {month}
          </div>
        ))}
      </div>
      {selectedMonth && (
        <div>
          <h2 className="text-xl font-bold mb-4">{selectedMonth}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastAppointments
              .filter(
                (appointment) =>
                  new Date(appointment.date).toLocaleString("default", {
                    month: "long",
                  }) === selectedMonth
              )
              .map((appointment, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-bold mb-2">
                    {appointment.title}
                  </h2>
                  <p className="text-gray-600">{appointment.date}</p>
                  <p className="text-gray-600">{appointment.time}</p>
                  <p className="text-gray-600">{appointment.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment_past;
