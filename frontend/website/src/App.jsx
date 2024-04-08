// importing react stuff

import { Route, Routes } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
// importing ui and extras stuff
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { app, auth } from "./firebase.js"; // to run app file.

// importing components
import SideNav from "./components/SideNav.jsx";
import AppointmentDetailsNav from "./components/AppointmentDetailsNav.jsx";

// importing pages
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";

import ProtectedRoutes from "./ProtectedRoutes";
import BookAppointmentNav from "./components/BookAppointmentNav.jsx";

// importing context
import { BaseUrlContext } from "./context/BaseUrlContext.jsx";

function App() {
  useEffect(() => {
    const instance = axios.create({
      baseURL: "http://localhost:3000/assistant",
      // Other configurations like headers, timeout, etc.
    });

    instance.interceptors.response.use(
      (response) => {
        // Do something with successful response
        return response;
      },
      (error) => {
        // Handle error responses globally
        const { status } = error.response;
        console.log("Interceptor triggered with status code:", status);
        if (status === 401 || status === 403) {
          // Perform logout and redirect to home page
          console.log("Logging out...");
          navigate("/"); // Redirect to home page
        } else {
          // For other error statuses, log the error
          console.error("Request failed with status code:", status);
        }
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // User is not authenticated, perform logout and redirect
        window.location.href = "/";
        logout();
      }
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  function logout() {
    // Clear local storage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("allUsers");
    localStorage.removeItem("userSchedule");

    // Reset state variables
    setUserToken(null);
    setUserDetails(null);
    setAllUsers([]);
    setUserSchedule({
      taken_appointments: [],
      given_appointments: [],
      blocked_appointments: [],
    });
  }

  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setRefreshed(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (refreshed) {
      window.location.href = "/";
      logout();
    }
  }, [refreshed]);

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
      <BookAppointmentNav />
      <div className="z-1">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoutes path="/home" />} />
          <Route
            path="/upcoming_appointments"
            element={<ProtectedRoutes path="/upcoming_appointments" />}
          />
          <Route
            path="/user_schedule"
            element={<ProtectedRoutes path="/user_schedule" />}
          />
          <Route
            path="/appointment-past"
            element={<ProtectedRoutes path="/appointment-past" />}
          />
          <Route
            path="/new_appointment"
            element={<ProtectedRoutes path="/new_appointment" />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoutes path="/profile" />}
          />
          <Route
            path="/day-details"
            element={<ProtectedRoutes path="/day-details" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
