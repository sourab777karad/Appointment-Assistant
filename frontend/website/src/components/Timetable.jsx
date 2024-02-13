import React from "react";

const Timetable = ({ timetableData, scheduledSlots }) => {
  // Helper function to get scheduled slot details for a given day and time
  const getScheduledSlotDetails = (day, time) => {
    const slot = scheduledSlots.find(
      (slot) => slot.day === day && slot.time === time
    );
    return slot ? (
      <div>
        <p>{slot.Name}</p>
        <p>{slot.Class}</p>
        <p>{slot.PRN}</p>
      </div>
    ) : null;
  };

  return (
    <div className="timetable">
      <h2 className="text-4xl font-bold  mt-12 mb-12 text-center">Timetable</h2>
      <div className="grid grid-cols-7 gap-0 border border-gray-300">
        <div className="border-r border-b border-gray-300 p-4"></div>
        <div className="border-r border-b border-gray-300 font-bold p-4">
          Monday
        </div>
        <div className="border-r border-b border-gray-300 font-bold p-4">
          Tuesday
        </div>
        <div className="border-r border-b border-gray-300 font-bold p-4">
          Wednesday
        </div>
        <div className="border-r border-b border-gray-300 font-bold p-4">
          Thursday
        </div>
        <div className="border-r border-b border-gray-300 font-bold p-4">
          Friday
        </div>
        <div className="border-r border-b border-gray-300 font-bold p-4">
          Saturday
        </div>
        {timetableData.map((timeslot, index) => (
          <React.Fragment key={index}>
            <div className="border-r border-b border-gray-300 p-4">
              {timeslot.time}
            </div>
            <div
              className={`border-r border-b border-gray-300 p-4 ${
                scheduledSlots.some(
                  (slot) => slot.day === "Monday" && slot.time === timeslot.time
                )
                  ? "bg-green-200"
                  : ""
              }`}
            >
              {getScheduledSlotDetails("Monday", timeslot.time)}
            </div>
            <div
              className={`border-r border-b border-gray-300 p-4 ${
                scheduledSlots.some(
                  (slot) =>
                    slot.day === "Tuesday" && slot.time === timeslot.time
                )
                  ? "bg-green-200"
                  : ""
              }`}
            >
              {getScheduledSlotDetails("Tuesday", timeslot.time)}
            </div>
            <div
              className={`border-r border-b border-gray-300 p-4 ${
                scheduledSlots.some(
                  (slot) =>
                    slot.day === "Wednesday" && slot.time === timeslot.time
                )
                  ? "bg-green-200"
                  : ""
              }`}
            >
              {getScheduledSlotDetails("Wednesday", timeslot.time)}
            </div>
            <div
              className={`border-r border-b border-gray-300 p-4 ${
                scheduledSlots.some(
                  (slot) =>
                    slot.day === "Thursday" && slot.time === timeslot.time
                )
                  ? "bg-green-200"
                  : ""
              }`}
            >
              {getScheduledSlotDetails("Thursday", timeslot.time)}
            </div>
            <div
              className={`border-r border-b border-gray-300 p-4 ${
                scheduledSlots.some(
                  (slot) => slot.day === "Friday" && slot.time === timeslot.time
                )
                  ? "bg-green-200"
                  : ""
              }`}
            >
              {getScheduledSlotDetails("Friday", timeslot.time)}
            </div>
            <div
              className={`border-r border-b border-gray-300 p-4 ${
                scheduledSlots.some(
                  (slot) =>
                    slot.day === "Saturday" && slot.time === timeslot.time
                )
                  ? "bg-green-200"
                  : ""
              }`}
            >
              {getScheduledSlotDetails("Saturday", timeslot.time)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
