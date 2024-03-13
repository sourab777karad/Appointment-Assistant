/**
 * Main entry point of the React application.
 * Renders the root component wrapped in necessary providers and routers.
 *
 * @file FILEPATH: /p:/Programs/JavaScript/Appointment-Assistant/frontend/website/src/main.jsx
 * @module Main
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BaseUrlProvider } from "./context/BaseUrlContext";
import { BrowserRouter } from "react-router-dom";
import { UserInfoContextProvider } from "./context/UserInfoContext.jsx";
const root = ReactDOM.createRoot(document.getElementById("root"));

/**
 * Renders the root component of the application.
 */
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BaseUrlProvider>
        <UserInfoContextProvider>
          <App />
        </UserInfoContextProvider>
      </BaseUrlProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
