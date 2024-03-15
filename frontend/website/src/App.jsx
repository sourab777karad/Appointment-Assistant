// importing react stuff

import { useState, useEffect } from "react";
import { Route, Routes, Router, useLocation, useNavigate } from "react-router-dom";

// importing ui and extras stuff

import { Toaster } from "react-hot-toast";
import { app } from "./firebase.js"; // to run app file.

// importing components
import SideNav from "./components/SideNav.jsx";
import AppointmentDetailsNav from "./components/AppointmentDetailsNav.jsx";

// importing pages
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";

import ProtectedRoutes from "./ProtectedRoutes";

function App() {
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
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
				</Routes>
				{<ProtectedRoutes />}
			</div>
		</>
	);
}

export default App;
