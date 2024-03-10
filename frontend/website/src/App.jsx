// importing react stuff

import { useState, useEffect, useContext } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// importing ui and extras stuff

import { Toaster } from "react-hot-toast";
import { app } from "./firebase.js"; // to run app file.

// importing components
import NavbarWithSearch from "./components/NavbarWithSearch.jsx";
import SideNav from "./components/SideNav.jsx";
import AppointmentDetailsNav from "./components/AppointmentDetailsNav.jsx";

// importing pages
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Appointment from "./pages/Appointment_user";
import Appointment_admin from "./pages/Appointment_admin";
import Appointment_past from "./pages/Appointment_past";
import Profile from "./pages/Profile";
import NewAppointment from "./pages/NewAppointment.jsx";

// importing context
import { UserInfoContext } from "./context/UserInfoContext";
import Footer from "./components/Footer.jsx";

function App() {
	// hooks
	const location = useLocation(); // Hook to get current location
	let navigate = useNavigate();

	// states

	const [isNavbarPresent, setisNavbarPresent] = useState(true); // Initially set Navbar as present
	const userToken = useContext(UserInfoContext).userToken;
	const [includeFooter, setIncludeFooter] = useState(true);
	// functions

	// Function to check if user is authenticated
	function isAuthenticated(userToken) {
		// Here you should replace this with the actual authentication check
		// check if the token attribute in userinfocontext is present
		if (userToken === null || userToken === undefined || userToken === "") {
			// else return false
			return false;
		}
		// if it is present, return true
		return true;
	}

	// effects
	useEffect(() => {
		// Array of paths where Navbar should not be present
		const pathsWithoutNavbar = ["/", "/signup"];

		// Check if current path is in the array of paths without Navbar
		const isPathWithoutNavbar = pathsWithoutNavbar.includes(
			location.pathname
		);

		if (isPathWithoutNavbar) {
			// Update isNavbarPresent based on the result
			setisNavbarPresent(false);
			setIncludeFooter(false);
		} else {
			setisNavbarPresent(true);
			if (!isAuthenticated(userToken)) {
				// replace this with your actual authentication check
				// navigate("/");
			}
			setIncludeFooter(true);
		}
	}, [location.pathname, userToken, setisNavbarPresent, navigate]); // useEffect dependency changed to location

	return (
		<>
			<Toaster
				position="top-right"
				reverseOrder={false}
				toastOptions={{
					style: {
						background: "#333",
						color: "#fff",
					},
				}}
			/>
			<SideNav />
			<AppointmentDetailsNav />
			<div className="z-1">
				{isNavbarPresent && <NavbarWithSearch isNavbarPresent={true} />}{" "}
				{/* Render Navbar based on state */}
				<div>
					<Routes>
						<Route
							path="/"
							element={
								<Login
									setisNavbarPresent={setisNavbarPresent}
								/>
							}
						/>
						<Route path="/home" element={<Home />} />
						<Route
							path="/signup"
							element={
								<Signup
									setisNavbarPresent={setisNavbarPresent}
								/>
							}
						/>
						<Route
							path="/appointment-user"
							element={<Appointment />}
						/>
						<Route
							path="/appointment-admin"
							element={<Appointment_admin />}
						/>
						<Route
							path="/appointment-past"
							element={<Appointment_past />}
						/>
						<Route
							path="/new_appointment"
							element={<NewAppointment />}
						/>
						<Route path="/profile" element={<Profile />} />
					</Routes>
				</div>
				{
					// include footer only if includeFooter is true
					includeFooter && <Footer />
				}
			</div>
		</>
	);
}

export default App;
