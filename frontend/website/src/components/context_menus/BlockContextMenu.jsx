import PropTypes from "prop-types";
import basic_functions from "../../utils/basic_functions";
import { UserInfoContext } from "../../context/UserInfoContext";
import { BaseUrlContext } from "../../context/BaseUrlContext";
import { useContext } from "react";

const BlockContextMenu = ({ x, y, onClose, date, time_slot }) => {
  const {
    userToken,
    userDetails,
    refreshLoggedInUserScheduleForDisplayedWeek,
    currentWeek,
    calculate_json_time_slots,
  } = useContext(UserInfoContext);
  const base_url = useContext(BaseUrlContext).baseUrl;
  const block_appointment = async () => {
    let appointment_details_list = [];
    //	this will call the block appointment function and give it the necessary details.

    // edge case, if both date and time are "", then we return
    if (date === "" && time_slot === "") {
      return;
    }

    // now if the date is "", then we wanna block the whole week. we will get currently displayed week from the UserInfoContext
    if (date === "") {
      const week_start_date = currentWeek.start_date;
      const week_start_time = time_slot.start_time;
      const week_end_time = time_slot.end_time;
      // make a list of appointments for each day of week, at given timeslot
      appointment_details_list = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(week_start_date).setDate(
          new Date(week_start_date).getDate() + i,
        );
        const formatted_date = new Date(date).toISOString().split("T")[0];
        appointment_details_list.push({
          appointment_date: formatted_date,
          start_time: week_start_time,
          end_time: week_end_time,
        });
      }
    }

    // now if the time_slot is "", then we wanna block the whole day. we will get current users json time slots from the UserInfoContext
    if (time_slot === "") {
      const json_time_slots = calculate_json_time_slots(
        userDetails.single_appointment_start_time,
        userDetails.single_appointment_end_time,
        userDetails.single_appointment_duration,
        userDetails.break_between_appointments,
      );
      appointment_details_list = [];
      for (let i = 0; i < json_time_slots.length; i++) {
        const time_slot = json_time_slots[i];
        appointment_details_list.push({
          appointment_date: date,
          start_time: time_slot.start_time,
          end_time: time_slot.end_time,
        });
      }
    }
    // now block the appointments
    basic_functions.block_appointment(
      appointment_details_list,
      base_url,
      userToken,
      userDetails,
      refreshLoggedInUserScheduleForDisplayedWeek,
    );
  };

  const unblock_appointment = async () => {
    let appointment_details_list = [];
    //	this will call the block appointment function and give it the necessary details.

    // edge case, if both date and time are "", then we return
    if (date === "" && time_slot === "") {
      return;
    }

    // now if the date is "", then we wanna block the whole week. we will get currently displayed week from the UserInfoContext
    if (date === "") {
      const week_start_date = currentWeek.start_date;
      const week_start_time = time_slot.start_time;
      const week_end_time = time_slot.end_time;
      // make a list of appointments for each day of week, at given timeslot
      appointment_details_list = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(week_start_date).setDate(
          new Date(week_start_date).getDate() + i,
        );
        const formatted_date = new Date(date).toISOString().split("T")[0];
        appointment_details_list.push({
          appointment_date: formatted_date,
          start_time: week_start_time,
          end_time: week_end_time,
        });
      }
    }

    // now if the time_slot is "", then we wanna block the whole day. we will get current users json time slots from the UserInfoContext
    if (time_slot === "") {
      const json_time_slots = calculate_json_time_slots(
        userDetails.single_appointment_start_time,
        userDetails.single_appointment_end_time,
        userDetails.single_appointment_duration,
        userDetails.break_between_appointments,
      );
      appointment_details_list = [];
      for (let i = 0; i < json_time_slots.length; i++) {
        const time_slot = json_time_slots[i];
        appointment_details_list.push({
          appointment_date: date,
          start_time: time_slot.start_time,
          end_time: time_slot.end_time,
        });
      }
    }

    // now block the appointments
    basic_functions.unblock_appointment(
      appointment_details_list,
      base_url,
      userToken,
      userDetails,
      refreshLoggedInUserScheduleForDisplayedWeek,
    );
  };

  const handleClick = (e) => {
    e.preventDefault(); // Prevent default right-click menu
    onClose(); // Close custom menu
  };

  return (
    <div
      className="custom-menu absolute z-50"
      style={{
        top: y,
        left: x,
      }}
      onClick={handleClick}
    >
      <div className="p-2">
        <ul className="menu bg-base-200 w-56 rounded-box">
          <li
            onClick={() => {
              block_appointment();
            }}
          >
            <a>Block</a>
          </li>
          <li
            onClick={() => {
              unblock_appointment();
            }}
          >
            <a>Un-Block</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BlockContextMenu;
BlockContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  time_slot: PropTypes.object.isRequired,
};
