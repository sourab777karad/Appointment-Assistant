import React, { useState } from "react";

const Calendar = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get the current date
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  // Function to get the number of days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get the first day of the month
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Function to handle navigation to the previous month
  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };

  // Function to handle navigation to the next month
  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  };

  // Generate array of dates for the current month
  const dates = [];
  const numDaysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  for (let i = 1; i <= numDaysInMonth; i++) {
    dates.push(i);
  }

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.unshift("");
  }

  // Function to handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={prevMonth}
        >
          Prev
        </button>
        <h2 className="text-xl font-bold">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={nextMonth}
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day, index) => (
          <div key={index} className="text-gray-600 font-bold">
            {day}
          </div>
        ))}
        {dates.map((date, index) => (
          <div
            key={index}
            className={`cursor-pointer text-gray-800 ${
              date ? "hover:bg-gray-200" : "opacity-0"
            }`}
            onClick={() => handleDateSelect(date)}
          >
            {date}
          </div>
        ))}
      </div>
      <p className="text-center mt-4">
        {selectedDate ? `Selected date: ${selectedDate}` : "Select a date"}
      </p>
    </div>
  );
};

export default Calendar;
