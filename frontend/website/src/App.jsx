// importing react stuff

import { Route, Routes } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
// importing ui and extras stuff

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
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(
  //     (user) => {
  //       console.log("Auth state changed:", user);
  //       if (!user) {
  //         console.log("User not authenticated. Redirecting to home page...");
  //         logout();
  //         window.location.href = "/";
  //       }
  //     },
  //     (error) => {
  //       console.error("Error in onAuthStateChanged:", error);
  //     }
  //   );

  //   return () => {
  //     console.log("Cleaning up authentication listener...");
  //     unsubscribe();
  //   };
  // }, []);

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
