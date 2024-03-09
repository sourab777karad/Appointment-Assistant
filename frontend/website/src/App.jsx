import { useState, useEffect, useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavbarWithSearch from "./components/NavbarWithSearch.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Appointment from "./pages/Appointment_user";
import Appointment_admin from "./pages/Appointment_admin";
import Appointment_past from "./pages/Appointment_past";
import Profile from "./pages/Profile";
import { app } from "./firebase.js";
import NewAppointment from "./pages/NewAppointment.jsx";
import { useNavigate } from "react-router-dom";
import { UserInfoContext } from "./context/UserInfoContext";

function App() {
	const location = useLocation(); // Hook to get current location
	let navigate = useNavigate();

	const [isNavbarPresent, setisNavbarPresent] = useState(true); // Initially set Navbar as present
	const userToken = useContext(UserInfoContext).userToken;

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
		} else {
			setisNavbarPresent(true);
			if (!isAuthenticated(userToken)) {
				// replace this with your actual authentication check
				// navigate("/");
			}
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
			</div>
		</>
	);
}

export default App;
