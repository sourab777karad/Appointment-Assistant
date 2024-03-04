import React from "react";
import Timetable from "../components/Timetable";

const timetableData = [
  {
    time: "09:00 AM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "09:20 AM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "09:40 AM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "10:00 AM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "10:20 AM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "10:40 AM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "11:00 AM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "11:20 AM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "11:40 AM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "12:00 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "12:20 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "12:40 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "01:00 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "01:20 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "01:40 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "02:00 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "02:20 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "02:40 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "03:00 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "03:20 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
  {
    time: "03:40 PM",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  },
];

const scheduledSlots = [
  {
    day: "Monday",
    time: "09:00 AM",
    Name: "John Doe",
    PRN: "123456789",
    Class: "A",
  },
  {
    day: "Monday",
    time: "10:20 AM",
    Name: "Alice Smith",
    PRN: "987654321",
    Class: "B",
  },
  {
    day: "Monday",
    time: "11:40 AM",
    Name: "Bob Johnson",
    PRN: "456789123",
    Class: "C",
  },
  {
    day: "Tuesday",
    time: "09:00 AM",
    Name: "Emma Brown",
    PRN: "654321987",
    Class: "D",
  },
  {
    day: "Tuesday",
    time: "10:20 AM",
    Name: "Michael Davis",
    PRN: "321987654",
    Class: "E",
  },
  {
    day: "Tuesday",
    time: "11:40 AM",
    Name: "Sophia Wilson",
    PRN: "789123456",
    Class: "F",
  },
  {
    day: "Wednesday",
    time: "09:00 AM",
    Name: "Oliver Martinez",
    PRN: "159263478",
    Class: "G",
  },
  {
    day: "Wednesday",
    time: "10:20 AM",
    Name: "Charlotte Taylor",
    PRN: "426537189",
    Class: "H",
  },
  {
    day: "Wednesday",
    time: "11:40 AM",
    Name: "William Anderson",
    PRN: "634872951",
    Class: "I",
  },
  {
    day: "Thursday",
    time: "09:00 AM",
    Name: "Ava Garcia",
    PRN: "875913246",
    Class: "J",
  },
  {
    day: "Thursday",
    time: "10:20 AM",
    Name: "James Rodriguez",
    PRN: "485739126",
    Class: "K",
  },
  {
    day: "Thursday",
    time: "11:40 AM",
    Name: "Mia Hernandez",
    PRN: "729485613",
    Class: "L",
  },
  {
    day: "Friday",
    time: "09:00 AM",
    Name: "Liam Perez",
    PRN: "638729145",
    Class: "M",
  },
  {
    day: "Friday",
    time: "10:20 AM",
    Name: "Ella Gonzalez",
    PRN: "926384715",
    Class: "N",
  },
  {
    day: "Friday",
    time: "11:40 AM",
    Name: "Noah Ramirez",
    PRN: "194287536",
    Class: "O",
  },
];

const Appointment_admin = () => {
  return (
    <div>
      <Timetable
        timetableData={timetableData}
        scheduledSlots={scheduledSlots}
        onSlotRightClick={handleContextMenu} // Pass the context menu handler to the Timetable component
      />

      {/* Context menu */}
      {contextMenuVisible && (
        <div
          className="context-menu"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <div onClick={() => handleMenuOption("Option 1")}>Option 1</div>
          <div onClick={() => handleMenuOption("Option 2")}>Option 2</div>
          <div onClick={() => handleMenuOption("Option 3")}>Option 3</div>
        </div>
      )}
    </div>
  );
};

export default Appointment_admin;
