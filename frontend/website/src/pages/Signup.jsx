import React, { useState, useEffect } from "react";
import { BaseUrlContext } from "../context/BaseUrlContext";
import { UserInfoContext } from "../context/UserInfoContext";
import "../index.css";
import { NavLink } from "react-router-dom";
import mit_logo_image from "../assets/mitwpu logo.jpg";
import aalogo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import { app, provider } from "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login = (props) => {
	const auth = getAuth(app);

	const base_url = React.useContext(BaseUrlContext).baseUrl;
	const setUserToken = React.useContext(UserInfoContext).setUserToken;

	const comment = document.getElementById("comment");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const mit_wpu_images = [
		"https://mit-wpu.managementquotainfo.in/wp-content/uploads/sites/2/2019/12/MIT-WPU.jpg",
		"https://www.searchurcollege.com/blog/wp-content/uploads/2022/12/MIT-WPU.png",
		"https://media.licdn.com/dms/image/C561BAQE3_siH6TBwIA/company-background_1536_768/0/1583912936297?e=2147483647&v=beta&t=_rQiWPDh2NCVHmpqARsIraO7N75Bh-W-P7FWAggl-qQ",
	];

	let navigate = useNavigate();

	function redirect() {
		props.setisNavbarPresent(true);
		navigate("/home");
	}

	const loginUserWithGoogle = () => {
		return new Promise((resolve, reject) => {
			signInWithPopup(auth, provider)
				.then((result) => {
					// This gives you a Google Access Token. You can use it to access the Google API.
					const credential =
						GoogleAuthProvider.credentialFromResult(result);
					const token = credential.accessToken;
					const user = result.user;
					console.log("user logged in: ", user);
					setUserToken(token);
					resolve();
				})
				.catch((error) => {
					console.log("error logging in: ", error);
					// Handle Errors here.
					const errorCode = error.code;
					const errorMessage = error.message;
					// The email of the user's account used.
					const email = error.email;
					// The AuthCredential type that was used.
					const credential =
						GoogleAuthProvider.credentialFromError(error);
					console.log(
						"error logging in: ",
						errorMessage,
						errorCode,
						email,
						credential
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
			.then(() => {
				redirect();
			})
			.catch((error) => {
				console.log("error logging in with Google", error);
			});
	};

	async function handleClick() {
		const response = await axios
			.post(
				`${base_url}/auth`,
				{},
				{
					params: {
						email: email,
						password: password,
					},
				}
			)
			.then((response) => {
				return response;
			})
			.catch((error) => {
				console.error(error);
				alert("server not running! a simulated response is being sent");
				const response = {
					data: {
						message: "simulation",
					},
				};
				return response;
			});
		if (response.data.message === "simulation") {
			// comment.innerHTML = "Login Successful! Redirecting to Home Page!";
			setTimeout(() => {
				redirect();
			}, 1000);
		}
		// check if the user exists in the database
		else if (response.data.message === "user found pass correct") {
			setTimeout(() => {
				redirect();
			}, 1000);
		} else if (response.data.message === "user found pass incorrect") {
			comment.innerHTML = "Password Incorrect! Try Again!";
		} else if (response.data.message === "user not found") {
			comment.innerHTML = "User Doesnt Exist! Try Again or Sign Up!";
		} else {
			comment.innerHTML = "Something went wrong! Call the Devs!";
			alert("Something went wrong! Call the Devs!");
		}
	}

	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const validatePassword = (password) => {
		const re =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return re.test(password);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateEmail(email)) {
			setEmailError("Please enter a valid email address.");
		} else {
			setEmailError("");
		}
		if (!validatePassword(password)) {
			setPasswordError(
				"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
			);
		} else {
			setPasswordError("");
			handleClick();
		}
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
						<img
							src={mit_logo_image}
							alt="mit logo"
							className="w-full p-0 m-0"
						/>
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
										<label className="block text-gray-700">
											Full Name
										</label>
										<input
											type="text"
											name=""
											id=""
											placeholder="Enter your Full Name"
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
											autoFocus=""
											autoComplete=""
											required=""
										/>
									</div>
									<div className="mt-4">
										<label className="block text-gray-700">
											Email Address
										</label>
										<input
											type="email"
											name=""
											id=""
											placeholder="example@mitwpu.edu.in"
											minLength={6}
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
										/>
									</div>
									<div className="mt-4">
										<label className="block text-gray-700">
											Phone Number
										</label>
										<input
											type="telephone"
											name=""
											id=""
											placeholder="+91 XXXXXXXXXX"
											minLength={6}
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
										<label className="block text-gray-700">
											Password
										</label>
										<input
											type="password"
											name=""
											id=""
											placeholder="Enter Password"
											minLength={6}
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
											required=""
										/>
									</div>
									<div className="mt-4">
										<label className="block text-gray-700">
											Confirm Password
										</label>
										<input
											type="password"
											name=""
											id=""
											placeholder="Enter Password"
											minLength={6}
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
											required=""
										/>
									</div>
									<div className="mt-4">
										<label className="block text-gray-700">
											Room Number
										</label>
										<input
											type="email"
											name=""
											id=""
											placeholder="Enter your Building and Room Number (eg. DR107)"
											className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
											autoFocus=""
											autoComplete=""
											required=""
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
						>
							Sign Up!
						</button>
						<hr className="my-6 border-gray-300 w-full" />
						<button
							type="button"
							className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
							onClick={handleGoogleLogin}
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
										<use
											xlinkHref="#a"
											overflow="visible"
										/>
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
								<span className="ml-4">
									Sign Up with Google!
								</span>
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

export default Login;
