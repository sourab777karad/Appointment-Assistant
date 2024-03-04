import { createContext, useState } from "react";

export const UserInfoContext = createContext();

export const UserInfoContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  return (
    <UserInfoContext.Provider value={{ userToken: userToken, setUserToken: setUserToken }}>
      {children}
    </UserInfoContext.Provider>
  );
};
