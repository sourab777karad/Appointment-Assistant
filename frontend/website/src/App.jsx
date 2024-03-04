// importing basics
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

// importing css
import "./index.css";

// importing components
import NavbarWithSearch from "./components/NavbarWithSearch.jsx";

// importing pages
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Appointment from "./pages/Appointment_user";
import Appointment_admin from "./pages/Appointment_admin";
import Appointment_past from "./pages/Appointment_past";
import Profile from "./pages/Profile";
import { BaseUrlProvider } from "./context/BaseUrlContext.jsx";
import { UserInfoContextProvider } from "./context/UserInfoContext.jsx";

// importing firebase
import { app } from "./firebase.js";

/**
 * The main component of the application.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
	/**
	 * State variable to determine if the navbar is present.
	 */
	const [isNavbarPresent, setisNavbarPresent] = useState(false);

	/**
	 * Custom theme object for the application.
	 */
	const customTheme = {
		button: {
			defaultProps: {},
			valid: {},
			styles: {},
		},
	};

	/**
	 * Effect hook to update the navbar presence based on the current URL path.
	 */
	useEffect(() => {
		if (
			window.location.pathname === "/signup" ||
			window.location.pathname === "/forgot_password" ||
			window.location.pathname === "/"
		) {
			setisNavbarPresent(false);
		} else {
			setisNavbarPresent(true);
		}
	}, [isNavbarPresent]);

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
				<div className="">
					{isNavbarPresent ? (
						<NavbarWithSearch
							setisNavbarPresent={setisNavbarPresent}
						/>
					) : null}
					<div>
						<Routes>
							<Route path="/" element={<Login
								setisNavbarPresent={setisNavbarPresent}
							/>} />
							<Route path="/home" element={<Home />} />
							<Route path="/signup" element={<Signup
								setisNavbarPresent={setisNavbarPresent}
							/>} />
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
