import React from "react";

export function TeachersList() {
  const teachers = [
    { name: "Teacher 1", roomNumber: "101" },
    { name: "Teacher 2", roomNumber: "102" },
    { name: "Teacher 3", roomNumber: "103" },
    { name: "Teacher 4", roomNumber: "104" },
    { name: "Teacher 5", roomNumber: "105" },
    { name: "Teacher 6", roomNumber: "106" },
    { name: "Teacher 7", roomNumber: "107" },
  ];

  return (
    <div className="bg-white border-2 border-black rounded-lg neumorphic p-4 ml-4">
      <h2 className="text-2xl  mb-4 flex justify-center items-center">
        Teacher Catalogue
      </h2>
      <div className="bg-white border-2 border-black rounded-lg neumorphic p-4 max-h-80 overflow-y-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-center">Name of Teacher</th>
              <th className="px-4 py-2 text-center">Room No.</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2 text-center">{teacher.name}</td>
                <td className="px-4 py-2 text-center">{teacher.roomNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeachersList;
