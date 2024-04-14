import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { auth } from "./firebase.js";
import SideNav from "./components/SideNav.jsx";
import AppointmentDetailsNav from "./components/AppointmentDetailsNav.jsx";
import BookAppointmentNav from "./components/BookAppointmentNav.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  const location = useLocation();
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    const instance = axios.create({
      baseURL: "http://localhost:3000/assistant",
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { status } = error.response;
        console.log("Interceptor triggered with status code:", status);
        if (status === 401 || status === 403) {
          console.log("Logging out...");
          window.location.href = "/";
          logout();
        } else {
          console.error("Request failed with status code:", status);
        }
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          window.location.href = "/";
          logout();
        }
      });
      return () => unsubscribe();
    }
  }, [location]);

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

  function logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("allUsers");
    localStorage.removeItem("userSchedule");
    // Reset state variables or perform any other cleanup if needed
  }

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
