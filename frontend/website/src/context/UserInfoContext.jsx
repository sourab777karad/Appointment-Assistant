import { createContext, useState } from "react";

export const UserInfoContext = createContext();

export const UserInfoContextProvider = ({ children }) => {
	const [userToken, setUserToken] = useState(null);
	const [currentAppointment, setCurrentAppointment] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

	return (
		<UserInfoContext.Provider
			value={{
				userToken: userToken,
				setUserToken: setUserToken,
				currentAppointment: currentAppointment,
        setCurrentAppointment: setCurrentAppointment,
        userDetails: userDetails,
        setUserDetails: setUserDetails
			}}
		>
			{children}
		</UserInfoContext.Provider>
	);
};
