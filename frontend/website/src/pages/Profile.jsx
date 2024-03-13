import React, { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../context/UserInfoContext";
import axios from "axios";
import { BaseUrlContext } from "../context/BaseUrlContext";
import { IconArmchair, IconCheckbox, IconPhone, IconUserEdit } from "@tabler/icons-react";
import { toast } from "react-hot-toast";
import { ProfileCard } from "../components/ProfileCard";

const Profile = () => {
	const userDetails = useContext(UserInfoContext).userDetails;
	var [localUserDetails, setLocalUserDetails] = useState({
		full_name: "",
		email: "",
		phone_number: "",
		room: "",
	});

	const base_url = useContext(BaseUrlContext).baseUrl;
	const userToken = useContext(UserInfoContext).userToken;
	const refreshProfile = useContext(UserInfoContext).refreshProfile;

	const uploadProfilePicture = () => {
		// open file picker for only png and jpg files and for file size less than 5mb
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.click();
		fileInput.addEventListener("change", async (e) => {
			const file = e.target.files[0];
			if (file.size > 5000000) {
				toast.error("File size should be less than 5mb");
				return;
			}
			if (file.type !== "image/png" && file.type !== "image/jpeg") {
				toast.error("Only PNG and JPEG files are allowed");
				return;
			}
			const formData = new FormData();
			formData.append("image", file);
			try {
				const response = axios.post(`${base_url}/update-profile-photo`, formData, {
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				});

				toast.promise(response, {
					loading: "Updating Profile Picture...",
					success: "Profile Picture Updated",
					error: "Error updating profile picture",
				});
				response.then((response) => {
					if (response.status === 200) {
						setLocalUserDetails({
							...localUserDetails,
							profile_pic_url: response.data.profile_pic_url,
						});
						refreshProfile();
					}
				});
			} catch (error) {
				toast.error("Error updating profile picture");
			}
		});
	};

	const uploadUserDetails = async () => {
		try {
			const response = axios.post(`${base_url}/update-user-profile`, localUserDetails, {
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			});

			toast.promise(response, {
				loading: "Updating Profile...",
				success: "Profile Updated",
				error: "Error updating profile",
			});

			response.then(() => {
				refreshProfile();
			});
		} catch (error) {
			toast.error("Error updating profile");
		}
	};

	useEffect(() => {
		setLocalUserDetails(userDetails);
	}, [userDetails]);

	return (
		<div className="min-h-screen flex mt-16 items-center justify-center">
			<div className="flex justify-between w-4/5 max-w-screen-xl gap-20 p-20">
				{/* Profile Information */}
				<ProfileCard
					userDetails={userDetails}
					uploadProfilePicture={uploadProfilePicture}
				/>

				{/* Placeholder Div */}
				<div className="w-3/5 bg-gradient-to-br from-blue-50 to-white  p-10 rounded-lg shadow-lg border border-gray-300 h-[60vh] overflow-y-auto">
					<div className="flex h-full w-full flex-col gap-4 justify-between">
						<div>
							<h2 className="text-2xl font-bold">Your Profile Details</h2>
						</div>
						<div className="flex flex-col gap-4 w-full">
							<div>
								<h3 className="text-lg font-semibold">Phone Number</h3>
							</div>
							<label className="input input-bordered flex items-center gap-2 w-full">
								<IconPhone />
								<input
									type="text"
									value={localUserDetails?.phone_number}
									onChange={(e) => {
										setLocalUserDetails({
											...localUserDetails,
											phone_number: e.target.value,
										});
									}}
									className="grow w-full"
									placeholder="10 Digit Phone Number (No country code)"
								/>
							</label>
							<div>
								<h3 className="text-lg font-semibold">Full Name</h3>
							</div>
							<label className="input input-bordered flex items-center gap-2 w-full">
								<IconUserEdit />
								<input
									type="text"
									value={localUserDetails?.full_name}
									onChange={(e) => {
										setLocalUserDetails({
											...localUserDetails,
											full_name: e.target.value,
										});
									}}
									className="grow w-full"
									placeholder="Your Displayed Name"
								/>
							</label>
							<div>
								<h3 className="text-lg font-semibold">Room Number</h3>
							</div>
							<label className="input input-bordered flex items-center gap-2 w-full">
								<IconArmchair />
								<input
									type="text"
									value={localUserDetails?.room}
									onChange={(e) => {
										setLocalUserDetails({
											...localUserDetails,
											room: e.target.value,
										});
									}}
									className="grow w-full"
									placeholder="DR203"
								/>
							</label>
							<div>
								<h3 className="text-lg font-semibold">Appointment Duration</h3>
							</div>
							<label className="input input-bordered flex items-center gap-2 w-full">
								<IconArmchair />
								<input
									type="text"
									value={localUserDetails?.single_appointment_duration}
									onChange={(e) => {
										setLocalUserDetails({
											...localUserDetails,
											single_appointment_duration: e.target.value,
										});
									}}
									className="grow w-full"
									placeholder="Duration in Minutes (Default: 15)"
								/>
							</label>
							<div>
								<h3 className="text-lg font-semibold">Appointments Start Time</h3>
							</div>
							<label className="input input-bordered flex items-center gap-2 w-full">
								<IconArmchair />
								<input
									type="text"
									value={localUserDetails?.single_appointment_start_time}
									onChange={(e) => {
										setLocalUserDetails({
											...localUserDetails,
											single_appointment_start_time: e.target.value,
										});
									}}
									className="grow w-full"
									placeholder="Start Time Hours in 24 Hour Format (Default: 9)"
								/>
							</label>
							<div>
								<h3 className="text-lg font-semibold">Appointments End time</h3>
							</div>
							<label className="input input-bordered flex items-center gap-2 w-full">
								<IconArmchair />
								<input
									type="text"
									value={localUserDetails?.single_appointment_end_time}
									onChange={(e) => {
										setLocalUserDetails({
											...localUserDetails,
											single_appointment_end_time: e.target.value,
										});
									}}
									className="grow w-full"
									placeholder="End Time Hours in 24 Hour Format (Default: 17)"
								/>
							</label>
							<div>
								<h3 className="text-lg font-semibold">
									Break between Appointments
								</h3>
							</div>
							<label className="input input-bordered flex items-center gap-2 w-full">
								<IconArmchair />
								<input
									type="text"
									value={localUserDetails?.break_between_appointments}
									onChange={(e) => {
										setLocalUserDetails({
											...localUserDetails,
											break_between_appointments: e.target.value,
										});
									}}
									className="grow w-full"
									placeholder="In Minutes (Default: 5)"
								/>
							</label>
							<div>
								<h3 className="text-lg font-semibold">
									Students Meeting Start Time
								</h3>
							</div>
							<label className="input input-bordered flex items-center gap-2 w-full">
								<IconArmchair />
								<input
									type="text"
									value={localUserDetails?.student_meeting_start_time}
									onChange={(e) => {
										setLocalUserDetails({
											...localUserDetails,
											student_meeting_start_time: e.target.value,
										});
									}}
									className="grow w-full"
									placeholder="In 24 Hours (Default: 9)"
								/>
							</label>
							<div>
								<h3 className="text-lg font-semibold">Students Meeting End Time</h3>
							</div>
							<label className="input input-bordered flex items-center gap-2 w-full">
								<IconArmchair />
								<input
									type="text"
									value={localUserDetails?.student_meeting_end_time}
									onChange={(e) => {
										setLocalUserDetails({
											...localUserDetails,
											student_meeting_end_time: e.target.value,
										});
									}}
									className="grow w-full"
									placeholder="In 24 Hours (Default: 17)"
								/>
							</label>
						</div>
						<div className="w-full">
							<button
								className="btn hover:bg-blue-900 bg-blue-800 text-white w-full mb-10"
								onClick={() => {
									uploadUserDetails();
								}}
							>
								<IconCheckbox size={24} stroke={2} />
								Update Details
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
