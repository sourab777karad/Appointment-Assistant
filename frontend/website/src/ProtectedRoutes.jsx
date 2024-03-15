import { useRoutes } from "react-router-dom";
import { useContext } from "react";
import { UserInfoContext } from "./context/UserInfoContext";
import UpcomingAppointments from "./pages/UpcomingAppointments";
import UserSchedule from "./pages/UserSchedule";
import Appointment_past from "./pages/Appointment_past";
import Profile from "./pages/Profile";
import NewAppointment from "./pages/NewAppointment.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { Routes, Route } from "react-router-dom";
import NavbarWithSearch from "./components/NavbarWithSearch";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";

function ProtectedRoutes() {
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
		return false;
	}

	const element = <Login />;

	return (
		<div>
			{isAuthenticated() ? <NavbarWithSearch /> : null}
			<Routes>
				<Route path="*" element={<NotFound />} />
				<Route
					path="/upcoming_appointments"
					element={isAuthenticated() ? <UpcomingAppointments /> : element}
				/>
				<Route
					path="/user_schedule"
					element={isAuthenticated() ? <UserSchedule /> : element}
				/>
				<Route
					path="/appointment-past"
					element={isAuthenticated() ? <Appointment_past /> : element}
				/>
				<Route
					path="/new_appointment"
					element={isAuthenticated() ? <NewAppointment /> : element}
				/>
				<Route path="/home" element={isAuthenticated() ? <Home /> : element} />
				<Route path="/profile" element={isAuthenticated() ? <Profile /> : element} />,
			</Routes>
			{isAuthenticated() ? <Footer /> : null}
		</div>
	);
}

export default ProtectedRoutes;
