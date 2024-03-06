import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import NavbarWithSearch from "./components/NavbarWithSearch.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Appointment from "./pages/Appointment_user";
import Appointment_admin from "./pages/Appointment_admin";
import Appointment_past from "./pages/Appointment_past";
import Profile from "./pages/Profile";
import { BaseUrlProvider } from "./context/BaseUrlContext.jsx";
import { UserInfoContextProvider } from "./context/UserInfoContext.jsx";
import { app } from "./firebase.js";

function App() {
	const location = useLocation(); // Hook to get current location
	const [isNavbarPresent, setisNavbarPresent] = useState(true); // Initially set Navbar as present

	useEffect(() => {
		// Array of paths where Navbar should not be present
		const pathsWithoutNavbar = ["/", "/signup", "/forgot_password"];

		// Check if current path is in the array of paths without Navbar
		const isPathWithoutNavbar = pathsWithoutNavbar.includes(
			location.pathname
		);

		// Update isNavbarPresent based on the result
		setisNavbarPresent(!isPathWithoutNavbar);
	}, [location]); // useEffect dependency changed to location

	return (
		<BaseUrlProvider>
			<UserInfoContextProvider>
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
					{isNavbarPresent && (
						<NavbarWithSearch isNavbarPresent={true} />
					)}{" "}
					{/* Render Navbar based on state */}
					<div>
						<Routes>
							<Route
								path="/"
								element={
									<Login setisNavbarPresent={setisNavbarPresent} />
								}
							/>
							<Route path="/home" element={<Home />} />
							<Route
								path="/signup"
								element={
									<Signup setisNavbarPresent={setisNavbarPresent} />
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
							<Route path="/profile" element={<Profile />} />
						</Routes>
					</div>
				</div>
			</UserInfoContextProvider>
		</BaseUrlProvider>
	);
}

export default App;
