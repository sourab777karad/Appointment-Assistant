import React, { useState } from "react";
import "./YearScroll.css";
const YearScroll = ({ onSelectYear }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
    onSelectYear(currentYear - 1); // Notify parent component of the selected year change
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
    onSelectYear(currentYear + 1); // Notify parent component of the selected year change
  };

  return (
    <div className="year-scroll-container">
      <button className="arrow-button" onClick={handlePrevYear}>
        {"<"}
      </button>
      <span className="year">{currentYear}</span>
      <button className="arrow-button" onClick={handleNextYear}>
        {">"}
      </button>
    </div>
  );
};

export default YearScroll;
