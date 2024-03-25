import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../context/UserInfoContext";
import Schedule from "../components/Schedule";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BaseUrlContext } from "../context/BaseUrlContext";
import { format } from "date-fns";

const UserSchedule = () => {
  const {
    userSchedule,
    userToken,
    refreshLoggedInUserScheduleForDisplayedWeek,
    userDetails,
    currentWeek,
    setCurrentWeek,
    calculate_json_time_slots,
    calculate_time_slots,
  } = useContext(UserInfoContext);
  const base_url = useContext(BaseUrlContext).baseUrl;

  const [user_time_slots, setUser_time_slots] = useState([]);
  const [json_time_slots, setJson_time_slots] = useState([]);

  useEffect(() => {
    // update user schedule for the current week
    // refreshLoggedInUserScheduleForDisplayedWeek();
  }, []);

  useEffect(() => {
    if (userDetails === null) {
      return;
    }
    const user_time_slots = calculate_time_slots(
      userDetails.single_appointment_start_time,
      userDetails.single_appointment_end_time,
      userDetails.single_appointment_duration,
      userDetails.break_between_appointments,
    );
    setUser_time_slots(user_time_slots);

    const json_time_slots = calculate_json_time_slots(
      userDetails.single_appointment_start_time,
      userDetails.single_appointment_end_time,
      userDetails.single_appointment_duration,
      userDetails.break_between_appointments,
    );
    setJson_time_slots(json_time_slots);
  }, [currentWeek, userDetails]);

  const handleDateIncreased = (days) => {
    // this function will change the currentWeek to the next week
    // currentweek date formats are default js new Date() formats
    const nextWeek = {
      start_date: new Date(
        new Date(currentWeek.start_date).setDate(
          new Date(currentWeek.start_date).getDate() + days,
        ),
      ),
      end_date: new Date(
        new Date(currentWeek.end_date).setDate(
          new Date(currentWeek.end_date).getDate() + days,
        ),
      ),
    };

    setCurrentWeek(nextWeek);
    // now update the userSchedule
    refreshLoggedInUserScheduleForDisplayedWeek(nextWeek);
  };

  const handleDateDecreased = (days) => {
    // this function will change the currentWeek to the previous week
    const previousWeek = {
      start_date: new Date(
        new Date(currentWeek.start_date).setDate(
          new Date(currentWeek.start_date).getDate() - days,
        ),
      ),
      end_date: new Date(
        new Date(currentWeek.end_date).setDate(
          new Date(currentWeek.end_date).getDate() - days,
        ),
      ),
    };
    setCurrentWeek(previousWeek);
    // now update the userSchedule
    refreshLoggedInUserScheduleForDisplayedWeek(previousWeek);
  };

  return (
    <div className="pt-24">
      <div>
        <div>
          <h1 className="text-3xl font-semibold text-center mt-4 text-blue-800">
            User Schedule
          </h1>
        </div>
      </div>
      <Schedule
        user_id={userDetails.firebase_id}
        userSchedule={userSchedule}
        currentWeek={currentWeek}
        handleDateIncreased={handleDateIncreased}
        handleDateDecreased={handleDateDecreased}
        user_time_slots={user_time_slots}
        json_time_slots={json_time_slots}
      />
    </div>
  );
};

export default UserSchedule;
