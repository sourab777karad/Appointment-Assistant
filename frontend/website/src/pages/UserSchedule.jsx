import { useContext, useState } from "react";
import { UserInfoContext } from "../context/UserInfoContext";
import Schedule from "../components/Schedule";

const UserSchedule = () => {
	const UserSchedule = useContext(UserInfoContext).userSchedule;
	const setUserSchedule = useContext(UserInfoContext).setUserSchedule;

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
