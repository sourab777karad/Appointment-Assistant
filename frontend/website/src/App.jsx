// importing basics
import React from "react";
import {useState, useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@material-tailwind/react";

// importing css
import "./index.css";
import "./style.css";

// importing components
import Navbar from "./components/Navbar.jsx";

// importing pages
import Login from "./pages/Login";

function App() {
    const [isNavbarPresent, setisNavbarPresent] = useState(false);
    const customTheme = {
        button: {
            defaultProps: {...},
            valid: {...},
            styles: {...}
        }
    }

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
        <ThemeProvider
            value={customTheme}
        >
            <div className="">
                {isNavbarPresent ? (
                    <Navbar setisNavbarPresent={setisNavbarPresent}/>
                ) : null}
                <div>
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/signup" element={<Login/>}/>
                    </Routes>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
