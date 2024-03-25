import { useState, useContext, useEffect } from "react";
import { BaseUrlContext } from "../context/BaseUrlContext";
import { UserInfoContext } from "../context/UserInfoContext";
import "../index.css";
import mit_logo_image from "../assets/mitwpu logo.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

import { app, provider } from "../firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

function get_previous_monday_date() {
  // this gives you the date of the previous monday
  var d = new Date();
  var day = d.getDay();
  var diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function get_current_week_dates() {
  var curr = get_previous_monday_date(); // get current date
  var week = [];
  for (var i = 0; i < 7; i++) {
    week.push(format(curr, "yyyy-MM-dd"));
    curr.setDate(curr.getDate() + 1);
  }
  return week;
}

const Login = () => {
  const auth = getAuth(app);

  const base_url = useContext(BaseUrlContext).baseUrl;
  const setUserToken = useContext(UserInfoContext).setUserToken;
  const [setLocalUserToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setUserFullName] = useState("");
  const [setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [setFirebaseid] = useState("");
  const setUserDetails = useContext(UserInfoContext).setUserDetails;
  const setUserSchedule = useContext(UserInfoContext).setUserSchedule;
  const setAllUsers = useContext(UserInfoContext).setAllUsers;

  useEffect(() => {
    if (user) {
      setUserFullName(user.displayName);
      setUserEmail(user.email);
      setUserToken(user.accessToken);
      setLocalUserToken(user.accessToken);
      setFirebaseid(user.uid);
    }
  }, [user, setUserFullName, setUserEmail, setUserToken, setLocalUserToken]);

  const mit_wpu_images = [
    "https://mit-wpu.managementquotainfo.in/wp-content/uploads/sites/2/2019/12/MIT-WPU.jpg",
    "https://www.searchurcollege.com/blog/wp-content/uploads/2022/12/MIT-WPU.png",
  ];

  let navigate = useNavigate();

  function redirect() {
    navigate("/home");
  }

  async function askServerForUserDetails(user) {
    // this function asks the server for user details and returns a promise
    // if the user details are fetched successfully, the promise is resolved
    // if the user details are not fetched, the promise is rejected
    return new Promise((resolve, reject) => {
      axios
        .post(
          base_url + "/are-user-details-filled",
          {
            date: {
              start_date: get_current_week_dates()[0],
              end_date: get_current_week_dates()[6],
            },
          },
          {
            headers: {
              authorization: "Bearer " + user.accessToken,
            },
          },
        )
        .then((response) => {
          console.log("user details: ", response.data);
          setUserDetails(response.data.userDetails);
          resolve(response.data);
        })
        .catch((error) => {
          console.log("error fetching user details: ", error);
          reject(error);
        });
    });
  }

  async function addUserToDatabase(user) {
    // this function adds the user to the database and returns a promise
    // if the user is added successfully, the promise is resolved
    // if the user is not added, the promise is rejected
    return new Promise((resolve, reject) => {
      axios
        .post(
          base_url + "/add-new-user",
          {
            email: user.email,
            full_name: user.displayName,
            firebase_id: user.uid,
            profile_pic_url: "",
            room: "",
            phone_number: user.phoneNumber ? user.phoneNumber : "",
          },
          {
            headers: {
              authorization: "Bearer " + user.accessToken,
            },
          },
        )
        .then((response) => {
          // false means that the user already exists.
          if (response.data.status === false) {
            reject(response.data.message);
          }
          resolve();
        })
        .catch((error) => {
          console.log("error adding user to database: ", error);
          reject(error);
        });
    });
  }

  async function loginUser() {
    // this function logs in the user and returns a promise
    // if the user is logged in successfully, the promise is resolved
    // if the user is not logged in, the promise is rejected
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setUserToken(user.accessToken);
          setLocalUserToken(user.accessToken);
          resolve(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log("error code: ", errorCode);
          const errorMessage = error.message;
          console.log("error logging in: ", errorMessage);
          reject(error);
        });
    });
  }

  const loginUserWithGoogle = () => {
    return new Promise((resolve, reject) => {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          setUser(result.user);
          resolve(result.user);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(
            "error logging in: ",
            errorMessage,
            errorCode,
            email,
            credential,
          );
          reject(error);
        });
    });
  };

  const handleGoogleLogin = () => {
    const login_promise = loginUserWithGoogle();
    toast.promise(login_promise, {
      loading: "Logging in with Google...",
      success: "Logged in with Google successfully",
      error: "Error logging in with Google",
    });

    login_promise
      .then((user) => {
        setUserFullName(user.displayName);
        setUserEmail(user.email);
        setUserToken(user.accessToken);
        setLocalUserToken(user.accessToken);
        setFirebaseid(user.uid);
        // check if user details are filled
        const user_details_promise = askServerForUserDetails(user);
        toast.promise(user_details_promise, {
          loading: "Fetching user details...",
          success: "User details fetched successfully",
          error: "Error fetching user details",
        });
        // now if the user details are filled, redirect to home
        // else, redirect to the user details page
        user_details_promise
          .then((user_details) => {
            if (user_details.newUser) {
              // first add the user to the database
              const add_user_promise = addUserToDatabase(user);
              toast.promise(add_user_promise, {
                loading: "Adding user to database...",
                success: "User added to database successfully",
                error: "Could not add user to database.",
              });
              add_user_promise
                .then(() => {
                  // now redirect to the user details page
                  navigate("/profile");
                })
                .catch((error) => {
                  console.log("error adding user to database", error);
                });
            }
            if (user_details.filled) {
              setUserSchedule(user_details.userSchedule);
              setAllUsers(user_details.users);
              redirect();
            } else if (!user.filled) {
              toast.error("User details not filled. Please fill your details.");
              navigate("/profile");
            }
          })
          .catch((error) => {
            console.log("error fetching user details", error);
          });
      })
      .catch((error) => {
        console.log("error logging in with Google", error);
      });
  };

  const validateEmail = (email) => {
    // regex check for domain
    const domainRegex = /^[\w-]+(\.[\w-]+)*@mitwpu\.edu\.in$/;
    return domainRegex.test(email);
  };

  const validatePassword = (password) => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Password Invalid. Does not satisfy requirements.");
      return;
    }

    const login_promise = loginUser();
    toast.promise(login_promise, {
      loading: "Logging in...",
      success: "Logged in successfully",
      error: "Invalid email or password",
    });

    login_promise
      .then((resolved_user) => {
        // check if user details are filled
        const user_details_promise = askServerForUserDetails(resolved_user);
        toast.promise(user_details_promise, {
          loading: "Fetching user details...",
          success: "User details fetched successfully",
          error: "Error fetching user details",
        });
        // now if the user details are filled, redirect to home
        // else, redirect to the user details page
        user_details_promise
          .then((user_details) => {
            if (user_details.newUser) {
              // first add the user to the database
              const add_user_promise = addUserToDatabase(user);
              toast.promise(add_user_promise, {
                loading: "Adding user to database...",
                success: "User added to database successfully",
                error: "Could not add user to database.",
              });
              add_user_promise
                .then(() => {
                  // now redirect to the user details page
                  navigate("/profile");
                })
                .catch((error) => {
                  console.log("error adding user to database", error);
                });
            }
            if (user_details.filled) {
              // in case details are filled this is an old user, and we need to get his or her appointments.
              setUserSchedule(user_details.userSchedule);
              setAllUsers(user_details.users);
              redirect();
            } else if (!user.filled) {
              toast.error("User details not filled. Please fill your details.");
              navigate("/profile");
            }
          })
          .catch((error) => {
            console.log("error fetching user details", error);
          });

        // check if the users' email is verified
        const user = auth.currentUser;
        if (user.emailVerified) {
          console.log("user email verified");
        } else {
          console.log("user email not verified");
          toast.error("Please verify your email address");
          // send email verification link
          sendEmailVerification(user)
            .then(() => {
              toast.success("Email verification link sent successfully");
            })
            .catch((error) => {
              console.log("error sending email verification link", error);
              toast.error("Error sending email verification link");
            });
          return;
        }
        redirect();
      })
      .catch((error) => {
        console.log("error logging in", error);
      });
  };

  const handleForgotPassword = () => {
    // make sure email is valid
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    // send password reset email
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password reset email sent successfully");
      })
      .catch((error) => {
        console.log("error sending password reset email", error);
        toast.error("Error sending password reset email");
      });
  };

  return (
    <div className="p-0 m-0">
      <>
        <section className="flex flex-col md:flex-row h-screen items-center">
          <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
            <img
              src={mit_wpu_images[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="bg-white w-full md:max-w-md lg:max-w-full md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
  flex items-center justify-center"
          >
            <div className="w-full h-100">
              <div className="flex justify-center items-center flex-col h-44">
                <img
                  src={mit_logo_image}
                  alt="mit logo"
                  className="w-full p-0 m-0"
                />
              </div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight">
                Log in to Appointment Assistant
              </h1>
              <form className="mt-6" action="#" method="POST">
                <div>
                  <label className="block text-gray-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="example@mitwpu.edu.in"
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    autoFocus={true}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    autoComplete="on"
                    required={true}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    minLength={8}
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
                    required={true}
                  />
                </div>
                <div className="text-right mt-2" onClick={handleForgotPassword}>
                  <a
                    href="#"
                    className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                  >
                    Forgot Password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
        px-4 py-3 mt-6"
                  onClick={handleSubmit}
                >
                  Log In
                </button>
              </form>
              <hr className="my-6 border-gray-300 w-full" />
              <button
                type="button"
                className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
                onClick={() => {
                  handleGoogleLogin();
                }}
              >
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    className="w-6 h-6"
                    viewBox="0 0 48 48"
                  >
                    <defs>
                      <path
                        id="a"
                        d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                      />
                    </defs>
                    <clipPath id="b">
                      <use xlinkHref="#a" overflow="visible" />
                    </clipPath>
                    <path
                      clipPath="url(#b)"
                      fill="#FBBC05"
                      d="M0 37V11l17 13z"
                    />
                    <path
                      clipPath="url(#b)"
                      fill="#EA4335"
                      d="M0 11l17 13 7-6.1L48 14V0H0z"
                    />
                    <path
                      clipPath="url(#b)"
                      fill="#34A853"
                      d="M0 37l30-23 7.9 1L48 0v48H0z"
                    />
                    <path
                      clipPath="url(#b)"
                      fill="#4285F4"
                      d="M48 48L17 24l-4-3 35-10z"
                    />
                  </svg>
                  <span className="ml-4">Log in / Sign Up with Google</span>
                </div>
              </button>
              <p className="mt-8 w-full text-center">
                Need an account?{" "}
                <a
                  onClick={() => {
                    navigate("/signup");
                  }}
                  className="text-blue-500 hover:text-blue-700 font-semibold hover:cursor-pointer"
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>
        </section>
      </>
    </div>
  );
};

export default Login;

import PropTypes from "prop-types";

Login.propTypes = {
  props: PropTypes.object,
};
