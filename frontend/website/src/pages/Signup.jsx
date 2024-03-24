import React, { useState, useEffect } from "react";
import { BaseUrlContext } from "../context/BaseUrlContext";
import { UserInfoContext } from "../context/UserInfoContext";
import "../index.css";
import mit_logo_image from "../assets/mitwpu logo.jpg";
import aalogo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import { app, provider } from "../firebase";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from "firebase/auth";

const Signup = () => {
	const auth = getAuth(app);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [room, setRoom] = useState("");
	const [fullName, setFullName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [user, setUser] = useState(null);
	const [firebaseid, setFirebaseid] = useState("");
	const base_url = React.useContext(BaseUrlContext).baseUrl;
	const setUserToken = React.useContext(UserInfoContext).setUserToken;
	const userToken = React.useContext(UserInfoContext).userToken;

	const mit_wpu_images = [
		"https://mit-wpu.managementquotainfo.in/wp-content/uploads/sites/2/2019/12/MIT-WPU.jpg",
		"https://www.searchurcollege.com/blog/wp-content/uploads/2022/12/MIT-WPU.png",
		"https://media.licdn.com/dms/image/C561BAQE3_siH6TBwIA/company-background_1536_768/0/1583912936297?e=2147483647&v=beta&t=_rQiWPDh2NCVHmpqARsIraO7N75Bh-W-P7FWAggl-qQ",
	];

	useEffect(() => {
		if (user) {
			setUserToken(user.accessToken);
			setFullName(user.displayName);
			setEmail(user.email);
			setFirebaseid(user.uid);
			console.log("inside use effect", user);
		}
	}, [user, setUserToken, setFullName, setEmail, setFirebaseid]);

	let navigate = useNavigate();

	function redirect() {
		navigate("/");
	}

	async function addUserToDatabase(user) {
		// this function adds the user to the database and returns a promise
		// if the user is added successfully, the promise is resolved
		// if the user is not added, the promise is rejected
		console.log("adding user to database");
		console.log("local user token: ", user.accessToken);
		return new Promise((resolve, reject) => {
			axios
				.post(
					base_url + "/add-new-user",
					{
						email: email,
						full_name: fullName,
						firebase_id: user.uid,
						profile_pic_url: user.photoURL,
						room: room,
						phone_number: phoneNumber,
					},
					{
						headers: {
							authorization: "Bearer " + user.accessToken,
						},
					}
				)
				.then((response) => {
					console.log("user added to database: ", response.data);
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

	// signup user normally
	const signupNormally = () => {
		// create account with email and password in firebase
		// if successful, redirect to home page
		// if not, show error

		return new Promise((resolve, reject) => {
			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					// The user was created and signed in.
					const user = userCredential.user;
					sendEmailVerification(user)
						.then(() => {
							toast.success("Email verification link sent successfully", {
								autoClose: 5000,
							});
						})
						.catch((error) => {
							console.log("error sending email verification link", error);
							toast.error("Error sending email verification link");
						});
					// You can use the 'user' object here.
					resolve(user);
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					// Handle errors here.
					console.log("error signing up: ", errorCode, errorMessage);
					reject(error);
				});
		});
	};

	const signUpWithGoogle = () => {
		return new Promise((resolve, reject) => {
			signInWithPopup(auth, provider)
				.then(async (result) => {
					// This gives you a Google Access Token. You can use it to access the Google API.
					setUser(result.user);
					console.log("user logged in: ", result.user);
					resolve(result.user);
				})
				.catch((error) => {
					console.log("error logging in: ", error);
					// Handle Errors here.
					const errorCode = error.code;
					const errorMessage = error.message;
					// The email of the user's account used.
					const email = error.email;
					// The AuthCredential type that was used.
					const credential = GoogleAuthProvider.credentialFromError(error);
					console.log("error logging in: ", errorMessage, errorCode, email, credential);
					reject(error);
				});
		});
	};

	const handleGoogleSignup = () => {
		// check if all fields are filled
		// if not, show error

		if (!email || !password || !room || !fullName || !phoneNumber) {
			toast.error("Please fill all the fields");
			return;
		}

		// validate
		if (!validateAll()) {
			return;
		}

		const login_promise = signUpWithGoogle();
		toast.promise(login_promise, {
			loading: "Logging in with Google...",
			success: "Logged in with Google successfully",
			error: "Error logging in with Google",
		});

		login_promise
			.then((user) => {
				console.log("user logged in with google: ", user);
				const userPromise = addUserToDatabase(user);
				toast.promise(userPromise, {
					loading: "Adding user to database...",
					success: "User added to database successfully",
					error: "Error adding user to database",
				});
				userPromise
					.then(() => {
						redirect();
					})
					.catch((error) => {
						console.log("error adding user to database", error);
					});
			})
			.catch((error) => {
				console.log("error logging in with Google", error);
			});
	};

	const handleNormalSignup = (e) => {
		if (!email || !password || !room || !fullName || !phoneNumber) {
			toast.error("Please fill all the fields");
			return;
		}

		e.preventDefault();
		// check for all the validations
		if (!validateAll()) {
			return;
		}

		// now handle the signups.
		const signup_promise = signupNormally();
		toast.promise(signup_promise, {
			loading: "Signing up...",
			success: "Signed up successfully",
			error: "Error signing up",
		});

		signup_promise
			.then((user) => {
				console.log("user signed up: ", user);
				// add user to database
				const userPromise = addUserToDatabase(user);
				toast.promise(userPromise, {
					loading: "Adding user to database...",
					success: "User added to database successfully",
					error: "Error adding user to database",
				});

				userPromise
					.then(() => {
						redirect();
					})
					.catch((error) => {
						console.log("error adding user to database", error);
					});
			})
			.catch((error) => {
				console.log("error signing up", error);
			});
	};

	const validateEmail = (email) => {
		const domainRegex = /^[\w-]+(\.[\w-]+)*@mitwpu\.edu\.in$/;

		return domainRegex.test(email);
	};

	const validatePassword = (password) => {
		const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return re.test(password);
	};

	const validateRoom = (room) => {
		const re = /^[A-Z]{2}[0-9]{3}$/;
		return re.test(room);
	};

	const validatePhoneNumber = (phoneNumber) => {
		// 10 digit number without country code
		const re = /^[0-9]{10}$/;
		return re.test(phoneNumber);
	};

	const validatefullName = (fullName) => {
		const re = /^[a-zA-Z\s]+$/;
		return re.test(fullName);
	};

	const validateAll = () => {
		// check for all the validations
		if (!validateEmail(email)) {
			toast.error("Invalid Email. Please use your MIT WPU Email ID.");
			return false;
		}
		if (!validatePassword(password)) {
			toast.error(
				"Invalid Password. Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character."
			);
			return false;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return false;
		}

		if (!validateRoom(room)) {
			toast.error(
				"Invalid Room Number. Please enter your Building and Room Number (eg. DR107)"
			);
			return false;
		}
		if (!validatePhoneNumber(phoneNumber)) {
			toast.error(
				"Invalid Phone Number. Please enter a valid 10 digit phone number (without code)"
			);
			return false;
		}
		if (!validatefullName(fullName)) {
			toast.error("Invalid Full Name. Please enter a valid name.");
			return false;
		}
		return true;
	};

	return (
		<div className="p-0 m-0">
			<div
				className="flex justify-center items-center"
				style={{
					backgroundImage: `url(${mit_wpu_images[0]})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "100vh",
				}}
			>
				<section className="flex flex-col justify-between h-full items-center w-[80vw] bg-white pb-10">
					<div className="flex justify-center items-center flex-row w-1/4 aspect-auto my-10">
						<img src={mit_logo_image} alt="mit logo" className="w-full p-0 m-0" />
						<div className="border-l-2 border-gray-400 h-20 mx-4"></div>

						<img
							src={aalogo}
							alt="appointment assistant logo"
							className="w-full h-24 p-0 m-0"
						/>
					</div>
					<div className="flex w-full">
						<div
							className="bg-white w-full flex-1 md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-full px-6 lg:px-16 xl:px-12
            flex items-center justify-center"
						>
							<div className="w-full h-100">
								<h1 className="text-xl md:text-2xl font-bold leading-tight">
									Create a New Account
								</h1>
								<form
									className="mt-6 w-full flex flex-col justify-center"
									action="#"
									method="POST"
								>
									<div className="">
										<label className="block text-gray-700">Full Name</label>
										<input
											type="text"
											name=""
											id=""
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											placeholder="Enter your Full Name"
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
											autoFocus=""
											autoComplete=""
											required="true"
										/>
									</div>
									<div className="mt-4">
										<label className="block text-gray-700">Email Address</label>
										<input
											type="email"
											name=""
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required="true"
											placeholder="example@mitwpu.edu.in"
											minLength={6}
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
										/>
									</div>
									<div className="mt-4">
										<label className="block text-gray-700">Phone Number</label>
										<input
											type="telephone"
											name=""
											id=""
											value={phoneNumber}
											onChange={(e) => setPhoneNumber(e.target.value)}
											placeholder="XXXXXXXXXX (without country code)"
											minLength={6}
											required="true"
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
										/>
									</div>
								</form>
							</div>
						</div>
						<div
							className="bg-white w-full flex-1 md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-full px-6 lg:px-16 xl:px-12
  flex items-center justify-center"
						>
							{" "}
							<div className="w-full h-full">
								<form
									className="mt-6 flex justify-center flex-col"
									action="#"
									method="POST"
								>
									<div className="mt-4">
										<label className="block text-gray-700">Password</label>
										<input
											type="password"
											autoComplete="new-password"
											name=""
											id=""
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Enter Password"
											minLength={8}
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
											required="true"
										/>
									</div>
									<div className="mt-4">
										<label className="block text-gray-700">
											Confirm Password
										</label>
										<input
											type="password"
											autoComplete="new-password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											id=""
											placeholder="Enter Password Again to Confirm"
											minLength={8}
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
											required="true"
										/>
									</div>
									<div className="mt-4">
										<label className="block text-gray-700">Room Number</label>
										<input
											type="text"
											name=""
											id=""
											value={room}
											onChange={(e) => setRoom(e.target.value)}
											placeholder="Enter your Building and Room Number (eg. DR107)"
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
											autoFocus=""
											autoComplete=""
											required="true"
										/>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="w-1/3">
						<button
							type="submit"
							className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
        px-4 py-3 mt-6"
							onClick={handleNormalSignup}
						>
							Sign Up!
						</button>
						<hr className="my-6 border-gray-300 w-full" />
						<button
							type="button"
							className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
							onClick={handleGoogleSignup}
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
									<path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
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
								<span className="ml-4">Sign Up with Google!</span>
							</div>
						</button>
						<p className="mt-2 text-center w-full">
							Already have an Account? {"  "}
							<a
								onClick={() => {
									navigate("/");
								}}
								className="text-blue-500 hover:text-blue-700 font-semibold"
							>
								Log In!
							</a>
						</p>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Signup;
