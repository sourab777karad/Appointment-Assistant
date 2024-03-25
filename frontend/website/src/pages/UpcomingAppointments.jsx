import React, { useState } from "react";

const UpcomingAppointments = (myappointments) => {
  const appointments = [
    {
      title: "Appointment 1",
      date: "2024-02-13",
      time: "10:00 AM",
      description: "Lorem ipsum dolor sit amet",
      state: 1,
    },
    {
      title: "Appointment 2",
      date: "2024-02-14",
      time: "11:00 AM",
      description: "Consectetur adipiscing elit",
      state: 1,
    },
    {
      title: "Appointment 2",
      date: "2024-02-14",
      time: "11:00 AM",
      description: "Consectetur adipiscing elit",
      state: 1,
    },
    {
      title: "Appointment 2",
      date: "2024-02-14",
      time: "11:00 AM",
      description: "Consectetur adipiscing elit",
      state: 1,
    },
    {
      title: "Appointment 2",
      date: "2024-02-14",
      time: "11:00 AM",
      description: "Consectetur adipiscing elit",
    },
    {
      title: "Appointment 2",
      date: "2024-02-14",
      time: "11:00 AM",
      description: "Consectetur adipiscing elit",
      state: 1,
    },
  ];
  const [canceledAppointments, setCanceledAppointments] = useState([]);

  const handleCancel = (index) => {
    // Update the canceled appointments array
    setCanceledAppointments([...canceledAppointments, index]);
  };

  const isCanceled = (index) => {
    // Check if the appointment at the given index is canceled
    return canceledAppointments.includes(index);
  };
  return (
    <div className="pt-24">
      <div className="mx-16">
        <h1 className="text-3xl font-bold my-4 text-center">
          Your Upcoming Appointments
        </h1>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold mb-2">{appointment.title}</h2>
              <p className="text-gray-600">{appointment.date}</p>
              <p className="text-gray-600">{appointment.time}</p>
              <p className="text-gray-600">{appointment.description}</p>
              {!isCanceled(index) ? (
                <button
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleCancel(index)}
                >
                  Cancel
                </button>
              ) : (
                <button
                  className="mt-4 bg-gray-400 text-gray-600 font-bold py-2 px-4 rounded cursor-not-allowed"
                  disabled
                >
                  Canceled
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UpcomingAppointments;
