import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Schedule from "../components/Schedule";
import { UserInfoContext } from "../context/UserInfoContext";
import axios from "axios";
import { BaseUrlContext } from "../context/BaseUrlContext";
import { useContext } from "react";
import { format } from "date-fns";
import SearchableDropdown from "../components/SearchableDropdown";
import SearchIt from "../assets/searchit.svg";

const topProfs = [
  {
    role: "Course Coordinator",
    name: "Dr. XYZ",
    department: "Computer Science",
    roomNo: "A101",
    contact: "+1 (123) 456-7890",
    image_url: "../assets/img1.jpg",
  },
  {
    role: "Course Coordinator",
    name: "Dr. XYZ",
    department: "Computer Science",
    roomNo: "A101",
    contact: "+1 (123) 456-7890",
    image_url: "../assets/img1.jpg",
  },
  {
    role: "Course Coordinator",
    name: "Dr. XYZ",
    department: "Computer Science",
    roomNo: "A101",
    contact: "+1 (123) 456-7890",
    image_url: "../assets/img1.jpg",
  },
  {
    role: "Dean",
    name: "Dr. John Doe",
    department: "Computer Science",
    roomNo: "A101",
    contact: "+1 (123) 456-7890",
  },
  {
    role: "HOD",
    name: "Prof. Jane Smith",
    department: "Electrical Engineering",
    roomNo: "B201",
    contact: "+1 (234) 567-8901",
  },
  {
    role: "HOS",
    name: "Dr. Michael Johnson",
    department: "Mechanical Engineering",
    roomNo: "C301",
    contact: "+1 (345) 678-9012",
  },
  // Add more professors as needed
];

function get_previous_monday_date() {
  // this gives you the date of the previous monday
  var d = new Date();
  var day = d.getDay();
  var diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function get_current_week_dates() {
  var curr = get_previous_monday_date(); // get current date
  var week = [];
  for (var i = 0; i < 7; i++) {
    week.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return week;
}

const this_week_start = get_current_week_dates()[0];
const this_week_end = get_current_week_dates()[5];

export default function NewAppointment() {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProf, setSelectedProf] = useState("");

  const handleProfClick = (prof) => {
    // Handle click on professor tile
    setSelectedUser(""); // Clear selected user when a professor is clicked
    // You can perform additional actions here based on the selected professor
  };

  const {
    userToken,
    refreshLoggedInUserScheduleForDisplayedWeek,
    calculate_json_time_slots,
    calculate_time_slots,
    allUsers,
    userDetails,
    setNewAppointeeId,
    did_book_new_appointment,
  } = useContext(UserInfoContext);

  const base_url = useContext(BaseUrlContext).baseUrl;

  const [user_time_slots, setUser_time_slots] = useState([]);
  const [json_time_slots, setJson_time_slots] = useState([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [selectedUserSchedule, setSelectedUserSchedule] = useState({
    taken_appointments: [],
    given_appointments: [],
  });
  const [currentWeek, setCurrentWeek] = useState({
    start_date: this_week_start,
    end_date: this_week_end,
  });

  useEffect(() => {
    if (did_book_new_appointment) {
      getUserDetails(selectedUserDetails?.firebase_id);
      getUserSchedule(selectedUserDetails?.firebase_id);
    }
  }, [did_book_new_appointment]);

  const handleDateIncreased = (days) => {
    // this function will change the currentWeek to the next week
    const nextWeek = {
      start_date: new Date(
        new Date(currentWeek.start_date).setDate(
          new Date(currentWeek.start_date).getDate() + days
        )
      ),
      end_date: new Date(
        new Date(currentWeek.end_date).setDate(
          new Date(currentWeek.end_date).getDate() + days
        )
      ),
    };
    setCurrentWeek(nextWeek);
    // now update the userSchedule
    getUserSchedule(selectedUserDetails.firebase_id, nextWeek);
  };

  const handleDateDecreased = (days) => {
    // this function will change the currentWeek to the previous week
    const previousWeek = {
      start_date: new Date(
        new Date(currentWeek.start_date).setDate(
          new Date(currentWeek.start_date).getDate() - days
        )
      ),
      end_date: new Date(
        new Date(currentWeek.end_date).setDate(
          new Date(currentWeek.end_date).getDate() - days
        )
      ),
    };
    setCurrentWeek(previousWeek);
    // now update the userSchedule
    getUserSchedule(selectedUserDetails.firebase_id, previousWeek);
  };

  const change_status = (appointment, status) => {
    const response = axios
      .post(
        `${base_url}/change-status`,
        { status: status, appointment_id: appointment._id },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        refreshLoggedInUserScheduleForDisplayedWeek();
      })
      .catch((error) => {
        console.log(error);
      });

    toast.promise(response, {
      loading: "Loading",
      success: "Status changed successfully",
      error: "Error changing status",
    });
  };

  const getUserDetails = (firebase_id) => {
    const user = allUsers.find((user) => user.firebase_id === firebase_id);
    setSelectedUserDetails(user);
  };

  const getUserSchedule = (firebase_id, given_week = currentWeek) => {
    const response = axios
      .post(
        `${base_url}/get-faculty-schedule`,
        {
          date: {
            start_date: format(given_week.start_date, "yyyy-MM-dd"),
            end_date: format(given_week.end_date, "yyyy-MM-dd"),
          },
          firebase_id: firebase_id,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        let userSchedule = {
          taken_appointments: response.data.taken_appointments,
          given_appointments: response.data.given_appointments,
          blocked_appointments: response.data.blocked_appointments,
        };
        setSelectedUserSchedule(userSchedule);
      })
      .catch((error) => {
        console.log(error);
      });

    toast.promise(response, {
      loading: "Refreshing",
      success: "Done",
      error: "Error while Loading",
    });
  };

  const handleUserSelected = (firebase_id) => {
    const user_details = allUsers.find(
      (user) => user.firebase_id === firebase_id
    );
    setSelectedUserDetails(user_details);
    getUserDetails(user_details.firebase_id);
    getUserSchedule(user_details.firebase_id);
    setNewAppointeeId(user_details.firebase_id);
  };

  useEffect(() => {
    if (selectedUserDetails) {
      const user_time_slots = calculate_time_slots(
        selectedUserDetails.single_appointment_start_time,
        selectedUserDetails.single_appointment_end_time,
        selectedUserDetails.single_appointment_duration,
        selectedUserDetails.break_between_appointments
      );
      setUser_time_slots(user_time_slots);
      const json_time_slots = calculate_json_time_slots(
        selectedUserDetails.single_appointment_start_time,
        selectedUserDetails.single_appointment_end_time,
        selectedUserDetails.single_appointment_duration,
        selectedUserDetails.break_between_appointments
      );
      setJson_time_slots(json_time_slots);
    }
  }, [selectedUserDetails]);

  return (
    <div className="mt-10">
      {/* Book New Appointment Section */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold mt-24 mb-4 text-blue-800">
          Book New Appointment
        </h1>
      </div>

      {/* Select Faculty Section */}
      <div className="mt-2 text-center">
        <h2 className="text-2xl font-semibold text-blue-800">
          Select Faculty to Book Appointment With
        </h2>
        <div className="mt-4 mx-auto">
          <SearchableDropdown
            options={allUsers
              .filter((user) => user.firebase_id !== userDetails.firebase_id)
              .filter((user) => user.is_faculty === true)}
            onSelect={handleUserSelected}
          />
        </div>
      </div>

      {/* Display Tiles or Image Section */}
      <div className="flex">
        {/* Left Section (Tiles) */}
        <div id="abcd" className={`mt-4 ${selectedUser ? "hidden" : "block"}`}>
          <div className="flex flex-wrap p-4">
            {selectedUser === "" &&
              topProfs.map((prof, index) => (
                <div
                  key={index}
                  className="prof-card cursor-pointer"
                  onClick={() => handleProfClick(prof)}
                >
                  <div className="p-4 m-4 h-[200px] w-[200px] border border-black bg-blue-100 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center">
                    {/* Professor Information */}
                    <div className="ml-4">
                      <div className="text-lg font-semibold">{prof.name}</div>
                      <div className="text-sm font-semibold underline">
                        {prof.role}
                      </div>
                      <div className="text-sm">{prof.contact}</div>
                      <div className="text-sm">{prof.department}</div>
                      <div className="text-sm font-semibold">{prof.roomNo}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Section (Image) */}
        {!selectedUser && (
          <div className="w-2/5">
            <img
              src={SearchIt}
              alt="Professor"
              className="h-[500px] rounded-lg pr-12"
            />
          </div>
        )}
      </div>

      {/* Display Schedule Section */}
      {selectedUserDetails && (
        <Schedule
          userSchedule={selectedUserSchedule}
          currentWeek={currentWeek}
          handleDateIncreased={handleDateIncreased}
          handleDateDecreased={handleDateDecreased}
          block_appointment={null}
          user_time_slots={user_time_slots}
          json_time_slots={json_time_slots}
        />
      )}
    </div>
  );
}
