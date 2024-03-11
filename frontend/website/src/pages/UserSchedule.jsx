import { useContext, useState } from "react";
import { UserInfoContext } from "../context/UserInfoContext";
import Schedule from "../components/Schedule";

const UserSchedule = () => {
	const UserSchedule = useContext(UserInfoContext).userSchedule;
	const setUserSchedule = useContext(UserInfoContext).setUserSchedule;

	function change_status(appointment, status) {
		const response = axios
			.post(
				`${base_url}/change-status`,
				{ status: status, appointment_id: appointment._id },
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			)
			.then((response) => {
				console.log(response.data);
				refreshData();
			})
			.catch((error) => {
				console.log(error);
			});

		toast.promise(response, {
			loading: "Loading",
			success: "Status changed successfully",
			error: "Error changing status",
		});
	}

	return (
		<div className="pt-24">
			<div>
				<div>
					<h1 className="text-3xl font-semibold text-center mt-4 text-blue-800">
						User Schedule
					</h1>
				</div>
			</div>
			<Schedule userSchedule={UserSchedule} />
		</div>
	);
};

export default UserSchedule;
