import React, { useState, useEffect, useRef } from "react";

const SearchableDropdown = ({ options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topOptions = filteredOptions.slice(0, 4);

  const handleSelect = (firebaseId) => {
    onSelect(firebaseId);
    setSearchTerm("");
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
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a faculty member..."
        className="w-full p-2 focus:outline-none"
        onClick={() => setShowDropdown(true)} // Open dropdown on input click
      />
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
