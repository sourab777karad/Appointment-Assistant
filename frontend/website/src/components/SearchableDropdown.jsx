import React, { useState, useEffect, useRef } from "react";
import { IconSearch } from "@tabler/icons-react";

const SearchableDropdown = ({ options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topOptions = filteredOptions.slice(0, 4);

  const handleSelect = (firebaseId) => {
    const selected = options.find(
      (option) => option.firebase_id === firebaseId
    );
    setSelectedOption(selected);
    setSearchTerm(selected.full_name); // Set search term to selected option
    onSelect(firebaseId);
    setShowDropdown(false); // Close dropdown after selection
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="block w-1/2 mx-auto my-4 mt-4 p-2 rounded-md border border-gray-300 relative"
      ref={dropdownRef}
    >
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a faculty member..."
          className="w-full p-2 pl-10 pr-3 focus:outline-none"
          onClick={() => setShowDropdown(true)} // Open dropdown on input click
        />
        <button
          className="absolute inset-y-0  flex items-center px-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility on button click
        >
          <IconSearch size={25} strokeWidth={1.5} />
        </button>
      </div>
      {showDropdown && (
        <ul className="absolute z-10 w-full bg-white shadow-lg rounded-b-md mt-1">
          {topOptions.map((user) => (
            <li
              key={user.firebase_id}
              onClick={() => handleSelect(user.firebase_id)}
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              {user.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
