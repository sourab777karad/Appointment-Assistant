import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Navbar, Typography } from "@material-tailwind/react";
import { UserInfoContext } from "../context/UserInfoContext";

import logo from "../assets/logo.png";

function NavbarWithSearch() {
	const navigate = useNavigate();
	const [openNav, setOpenNav] = useState(false);
	const newNotifications = useContext(UserInfoContext).notifsExist;
	const logout = useContext(UserInfoContext).logout;

	const navList = (
		<ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
			<Typography
				as="li"
				variant="small"
				color="blue-gray"
				className="flex items-center gap-x-2 p-2 hover:scale-105 transform transition duration-300 ease-in-out hover:cursor-pointer rounded-lg px-4 hover:bg-gray-300 text-blue-900 quicksand text-md"
				onClick={() => navigate("/appointment-past")}
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24">
					<g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
						<g
							fill="none"
							stroke-dasharray="10"
							stroke-dashoffset="10"
							stroke-width="2"
						>
							<path d="M3 5L5 7L9 3">
								<animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									dur="0.2s"
									values="10;0"
								></animate>
							</path>
							<path d="M3 12L5 14L9 10">
								<animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="0.5s"
									dur="0.2s"
									values="10;0"
								></animate>
							</path>
							<path d="M3 19L5 21L9 17">
								<animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="1s"
									dur="0.2s"
									values="10;0"
								></animate>
							</path>
						</g>
						<g
							fill="currentColor"
							fillOpacity="0"
							stroke-dasharray="22"
							stroke-dashoffset="22"
						>
							<rect width="9" height="3" x="11.5" y="3.5" rx="1.5">
								<animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="0.2s"
									dur="0.5s"
									values="22;0"
								></animate>
								<animate
									fill="freeze"
									attributeName="fill-opacity"
									begin="1.7s"
									dur="0.5s"
									values="0;1"
								></animate>
							</rect>
							<rect width="9" height="3" x="11.5" y="10.5" rx="1.5">
								<animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="0.7s"
									dur="0.5s"
									values="22;0"
								></animate>
								<animate
									fill="freeze"
									attributeName="fill-opacity"
									begin="1.9s"
									dur="0.5s"
									values="0;1"
								></animate>
							</rect>
							<rect width="9" height="3" x="11.5" y="17.5" rx="1.5">
								<animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="1.2s"
									dur="0.5s"
									values="22;0"
								></animate>
								<animate
									fill="freeze"
									attributeName="fill-opacity"
									begin="2.1s"
									dur="0.5s"
									values="0;1"
								></animate>
							</rect>
						</g>
					</g>
				</svg>
				Past Appointments
			</Typography>
			<Typography
				as="li"
				variant="small"
				color="blue-gray"
				className="flex items-center gap-x-2 p-2 hover:scale-105 transform transition duration-300 ease-in-out hover:cursor-pointer rounded-lg px-4 hover:bg-gray-300 text-blue-900 quicksand text-md"
				onClick={() => navigate("/new_appointment")}
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24">
					<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
						<g stroke-dasharray="12" stroke-dashoffset="12">
							<path d="M12 7V17">
								<animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="0.8s"
									dur="0.2s"
									values="12;0"
								></animate>
							</path>
							<path d="M7 12H17">
								<animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="0.6s"
									dur="0.2s"
									values="12;0"
								></animate>
							</path>
						</g>
						<path
							stroke-dasharray="60"
							stroke-dashoffset="60"
							d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
						>
							<animate
								fill="freeze"
								attributeName="stroke-dashoffset"
								dur="0.5s"
								values="60;0"
							></animate>
						</path>
					</g>
				</svg>
				<span className="text-blue-900">Book New Appointment</span>
			</Typography>
			<Typography
				as="li"
				variant="small"
				color="blue-gray"
				className="flex items-center gap-x-2 p-2 hover:scale-105 transform transition duration-300 ease-in-out hover:cursor-pointer rounded-lg px-4 hover:bg-gray-300 text-blue-900 quicksand text-md"
				onClick={() => navigate("/user_schedule")}
			>
				<IconCalendar className="h-7 w-7" />
				<span className="text-blue-900">Your Schedule</span>
			</Typography>
			<Typography
				as="li"
				variant="small"
				color="blue-gray"
				className="flex items-center gap-x-2 p-2 hover:scale-105 transform transition duration-300 ease-in-out hover:cursor-pointer rounded-lg px-4 hover:bg-gray-300 text-blue-900 quicksand text-md"
				onClick={() => navigate("/upcoming_appointments")}
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24">
					<g
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
					>
						<rect
							width="16"
							height="16"
							x="4"
							y="4"
							stroke-dasharray="64"
							stroke-dashoffset="64"
							rx="1"
						>
							<animate
								fill="freeze"
								attributeName="stroke-dashoffset"
								dur="0.5s"
								values="64;0"
							></animate>
						</rect>
						<path stroke-dasharray="6" stroke-dashoffset="6" d="M7 4V2M17 4V2">
							<animate
								fill="freeze"
								attributeName="stroke-dashoffset"
								begin="0.5s"
								dur="0.2s"
								values="6;0"
							></animate>
						</path>
						<path stroke-dasharray="12" stroke-dashoffset="12" d="M7 11H17">
							<animate
								fill="freeze"
								attributeName="stroke-dashoffset"
								begin="0.8s"
								dur="0.2s"
								values="12;0"
							></animate>
						</path>
						<path stroke-dasharray="9" stroke-dashoffset="9" d="M7 15H14">
							<animate
								fill="freeze"
								attributeName="stroke-dashoffset"
								begin="1s"
								dur="0.2s"
								values="9;0"
							></animate>
						</path>
					</g>
					<rect width="14" height="0" x="5" y="5" fill="currentColor">
						<animate
							fill="freeze"
							attributeName="height"
							begin="0.5s"
							dur="0.2s"
							values="0;3"
						></animate>
					</rect>
				</svg>
				Upcoming Appointments
			</Typography>
		</ul>
	);

	return (
		<div className="fixed top-0 w-full z-10 quicksand">
			<Navbar className="mx-auto max-w-[95%] py-2">
				<div className="flex items-center justify-between text-blue-gray-900">
					{/* logo */}
					<Typography as="a" href="#" className="mr-4 cursor-pointer py-1.5 font-medium">
						<Link to="/home">
							<img
								className="p-0 m-0 scale-150"
								src={logo}
								height="50"
								width="50"
								alt="Logo"
							/>
						</Link>
					</Typography>
					{/* navlist */}
					<div className="hidden lg:block">{navList}</div>

					<div className="flex">
						{/* Search */}
						<Typography
							as="li"
							variant="small"
							color="blue-gray"
							className="flex items-center gap-x-2 p-2 hover:scale-105 transform transition duration-300 ease-in-out hover:cursor-pointer rounded-lg px-3 hover:bg-gray-300"
							onClick={() => navigate("/profile")}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-7 w-7"
								viewBox="0 0 24 24"
							>
								<g stroke="currentColor" stroke-linecap="round" stroke-width="2">
									<path
										fill="none"
										stroke-dasharray="16"
										stroke-dashoffset="16"
										d="M10.5 13.5L3 21"
									>
										<animate
											fill="freeze"
											attributeName="stroke-dashoffset"
											begin="0.4s"
											dur="0.2s"
											values="16;0"
										></animate>
									</path>
									<path
										fill="currentColor"
										fillOpacity="0"
										stroke-dasharray="40"
										stroke-dashoffset="40"
										d="M10.7574 13.2426C8.41421 10.8995 8.41421 7.10051 10.7574 4.75736C13.1005 2.41421 16.8995 2.41421 19.2426 4.75736C21.5858 7.10051 21.5858 10.8995 19.2426 13.2426C16.8995 15.5858 13.1005 15.5858 10.7574 13.2426Z"
									>
										<animate
											fill="freeze"
											attributeName="stroke-dashoffset"
											dur="0.4s"
											values="40;0"
										></animate>
										<animate
											fill="freeze"
											attributeName="fill-opacity"
											begin="0.6s"
											dur="0.15s"
											values="0;0.3"
										></animate>
									</path>
								</g>
							</svg>
						</Typography>
						{/* Account */}
						<Typography
							as="li"
							variant="small"
							color="blue-gray"
							className="flex items-center gap-x-2 p-2 hover:scale-105 transform transition duration-300 ease-in-out hover:cursor-pointer rounded-lg px-3 hover:bg-gray-300"
							onClick={() => navigate("/profile")}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-7 w-7"
								viewBox="0 0 24 24"
							>
								<g
									fill="currentColor"
									fillOpacity="0"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
								>
									<path
										stroke-dasharray="20"
										stroke-dashoffset="20"
										d="M12 5C13.66 5 15 6.34 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5z"
									>
										<animate
											fill="freeze"
											attributeName="stroke-dashoffset"
											dur="0.4s"
											values="20;0"
										></animate>
									</path>
									<path
										stroke-dasharray="36"
										stroke-dashoffset="36"
										d="M12 14C16 14 19 16 19 17V19H5V17C5 16 8 14 12 14z"
										opacity="0"
									>
										<set attributeName="opacity" begin="0.5s" to="1"></set>
										<animate
											fill="freeze"
											attributeName="stroke-dashoffset"
											begin="0.5s"
											dur="0.4s"
											values="36;0"
										></animate>
									</path>
									<animate
										fill="freeze"
										attributeName="fill-opacity"
										begin="0.9s"
										dur="0.5s"
										values="0;1"
									></animate>
								</g>
							</svg>
						</Typography>
						{/* Notifications */}
						<Typography
							as="li"
							variant="small"
							color="blue-gray"
							className="flex items-center gap-x-2 p-2 hover:scale-105 transform transition duration-300 ease-in-out hover:cursor-pointer rounded-lg px-3 hover:bg-gray-300"
							onClick={() => {
								document.getElementById(
									"notif-drawer"
									// "appointment-drawer"
								).checked = true;
							}}
							htmlFor="my-drawer"
						>
							{newNotifications ? (
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-7 w-7 text-red-500"
										viewBox="0 0 24 24"
									>
										<g
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-width="2"
										>
											<g>
												<path
													stroke-dasharray="4"
													stroke-dashoffset="4"
													d="M12 3V5"
												>
													<animate
														fill="freeze"
														attributeName="stroke-dashoffset"
														dur="0.2s"
														values="4;0"
													></animate>
												</path>
												<path
													fill="currentColor"
													fillOpacity="0"
													stroke-dasharray="28"
													stroke-dashoffset="28"
													d="M12 5C8.68629 5 6 7.68629 6 11L6 17C5 17 4 18 4 19H12M12 5C15.3137 5 18 7.68629 18 11L18 17C19 17 20 18 20 19H12"
												>
													<animate
														fill="freeze"
														attributeName="stroke-dashoffset"
														begin="0.2s"
														dur="0.4s"
														values="28;0"
													></animate>
													<animate
														fill="freeze"
														attributeName="fill-opacity"
														begin="0.8s"
														dur="0.15s"
														values="0;0.3"
													></animate>
												</path>
												<animateTransform
													attributeName="transform"
													begin="0.8s"
													dur="6s"
													keyTimes="0;0.05;0.15;0.2;1"
													repeatCount="indefinite"
													type="rotate"
													values="0 12 3;3 12 3;-3 12 3;0 12 3;0 12 3"
												></animateTransform>
											</g>
											<path
												stroke-dasharray="8"
												stroke-dashoffset="8"
												d="M10 20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20"
											>
												<animate
													fill="freeze"
													attributeName="stroke-dashoffset"
													begin="0.6s"
													dur="0.2s"
													values="8;0"
												></animate>
												<animateTransform
													attributeName="transform"
													begin="1s"
													dur="6s"
													keyTimes="0;0.05;0.15;0.2;1"
													repeatCount="indefinite"
													type="rotate"
													values="0 12 8;6 12 8;-6 12 8;0 12 8;0 12 8"
												></animateTransform>
											</path>
											<path
												stroke-dasharray="8"
												stroke-dashoffset="8"
												d="M22 6v4"
												opacity="0"
											>
												<set
													attributeName="opacity"
													begin="1s"
													to="1"
												></set>
												<animate
													fill="freeze"
													attributeName="stroke-dashoffset"
													begin="1s"
													dur="0.2s"
													values="8;0"
												></animate>
												<animate
													attributeName="stroke-width"
													begin="1.7s"
													dur="3s"
													keyTimes="0;0.1;0.2;0.3;1"
													repeatCount="indefinite"
													values="2;3;3;2;2"
												></animate>
											</path>
										</g>
										<circle
											cx="22"
											cy="14"
											r="1"
											fill="currentColor"
											fillOpacity="0"
										>
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												begin="1s"
												dur="0.4s"
												values="0;1"
											></animate>
											<animate
												attributeName="r"
												begin="2s"
												dur="3s"
												keyTimes="0;0.1;0.2;0.3;1"
												repeatCount="indefinite"
												values="1;2;2;1;1"
											></animate>
										</circle>
									</svg>
								</div>
							) : (
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-7 w-7"
										viewBox="0 0 24 24"
									>
										<g
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-width="2"
										>
											<g>
												<path
													stroke-dasharray="4"
													stroke-dashoffset="4"
													d="M12 3V5"
												>
													<animate
														fill="freeze"
														attributeName="stroke-dashoffset"
														dur="0.2s"
														values="4;0"
													/>
												</path>
												<path
													fill="currentColor"
													fill-opacity="0"
													stroke-dasharray="28"
													stroke-dashoffset="28"
													d="M12 5C8.68629 5 6 7.68629 6 11L6 17C5 17 4 18 4 19H12M12 5C15.3137 5 18 7.68629 18 11L18 17C19 17 20 18 20 19H12"
												>
													<animate
														fill="freeze"
														attributeName="stroke-dashoffset"
														begin="0.2s"
														dur="0.4s"
														values="28;0"
													/>
													<animate
														fill="freeze"
														attributeName="fill-opacity"
														begin="0.8s"
														dur="0.15s"
														values="0;0.3"
													/>
												</path>
												<animateTransform
													attributeName="transform"
													begin="0.8s"
													dur="6s"
													keyTimes="0;0.05;0.15;0.2;1"
													repeatCount="indefinite"
													type="rotate"
													values="0 12 3;3 12 3;-3 12 3;0 12 3;0 12 3"
												/>
											</g>
											<path
												stroke-dasharray="8"
												stroke-dashoffset="8"
												d="M10 20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20"
											>
												<animate
													fill="freeze"
													attributeName="stroke-dashoffset"
													begin="0.6s"
													dur="0.2s"
													values="8;0"
												/>
												<animateTransform
													attributeName="transform"
													begin="1s"
													dur="6s"
													keyTimes="0;0.05;0.15;0.2;1"
													repeatCount="indefinite"
													type="rotate"
													values="0 12 8;6 12 8;-6 12 8;0 12 8;0 12 8"
												/>
											</path>
										</g>
									</svg>
								</div>
							)}
						</Typography>
						{/* Log out */}
						<Typography
							as="li"
							variant="small"
							color="blue-gray"
							className="flex items-center gap-x-2 p-2 hover:scale-105 transform transition duration-300 ease-in-out hover:cursor-pointer rounded-lg px-3 hover:bg-gray-300"
							onClick={() => {
								logout();
								navigate("/");
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-7 w-7"
								viewBox="0 0 24 24"
							>
								<g
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-width="2"
								>
									<path
										stroke-dasharray="46"
										stroke-dashoffset="46"
										d="M16 5V4C16 3.44772 15.5523 3 15 3H6C5.44771 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H15C15.5523 21 16 20.5523 16 20V19"
									>
										<animate
											fill="freeze"
											attributeName="stroke-dashoffset"
											dur="0.5s"
											values="46;0"
										></animate>
									</path>
									<path
										stroke-dasharray="12"
										stroke-dashoffset="12"
										d="M10 12h11"
										opacity="0"
									>
										<set attributeName="opacity" begin="0.6s" to="1"></set>
										<animate
											fill="freeze"
											attributeName="stroke-dashoffset"
											begin="0.6s"
											dur="0.2s"
											values="12;0"
										></animate>
									</path>
									<path
										stroke-dasharray="6"
										stroke-dashoffset="6"
										d="M21 12l-3.5 -3.5M21 12l-3.5 3.5"
										opacity="0"
									>
										<set attributeName="opacity" begin="0.8s" to="1"></set>
										<animate
											fill="freeze"
											attributeName="stroke-dashoffset"
											begin="0.8s"
											dur="0.2s"
											values="6;0"
										></animate>
									</path>
								</g>
							</svg>
						</Typography>
					</div>
				</div>
				{openNav && <div className="lg:hidden">{navList}</div>}
			</Navbar>
		</div>
	);
}

export default NavbarWithSearch;

import { IconCalendar } from "@tabler/icons-react";