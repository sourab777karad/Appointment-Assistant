import { useContext } from "react";
import { UserInfoContext } from "./context/UserInfoContext";
import UpcomingAppointments from "./pages/UpcomingAppointments";
import UserSchedule from "./pages/UserSchedule";
import Appointment_past from "./pages/Appointment_past";
import Profile from "./pages/Profile";
import NewAppointment from "./pages/NewAppointment.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import NavbarWithSearch from "./components/NavbarWithSearch";
import Footer from "./components/Footer";
import DayDetails from "./pages/DayDetails";

function ProtectedRoutes({ path }) {
	const { userToken } = useContext(UserInfoContext);

	// Function to check if user is authenticated
	function isAuthenticated() {
		console.log(userToken);
		// Here you should replace this with the actual authentication check
		// check if the token attribute in userinfocontext is present
		if (userToken === null || userToken === undefined || userToken === "") {
			// else return false
			return false;
		}
		// if it is present, return true
		return true;
	}

	const element = <Login />;

	function getElement() {
		if (path === "/upcoming_appointments") {
			return isAuthenticated() ? <UpcomingAppointments /> : element;
		} else if (path === "/user_schedule") {
			return isAuthenticated() ? <UserSchedule /> : element;
		} else if (path === "/appointment-past") {
			return isAuthenticated() ? <Appointment_past /> : element;
		} else if (path === "/new_appointment") {
			return isAuthenticated() ? <NewAppointment /> : element;
		} else if (path === "/profile") {
			return isAuthenticated() ? <Profile /> : element;
		} else if (path === "/home") {
			return isAuthenticated() ? <Home /> : element;
		} else if (path === "/day-details") {
			return isAuthenticated() ? <DayDetails /> : element;
		}
	}

	return (
		<div>
			{isAuthenticated() ? <NavbarWithSearch /> : null}
			{getElement()}
			{isAuthenticated() ? <Footer /> : null}
		</div>
	);
}

export default ProtectedRoutes;

import PropTypes from "prop-types";

ProtectedRoutes.propTypes = {
	path: PropTypes.string.isRequired,
};
