import React, { createContext } from "react";

const ChatContext = createContext();
export default ChatContext;

export const ChatIDContext = createContext();
export const HistoryChatClicked = createContext();
export const ResponseRecieved = createContext();

export const loginCredentials = createContext();

export const LoginProvider = ({ children }) => {
  const [loginCred, setLoginCred] = useState({
    user: {
      displayName: "Demo User",
      email: "demo@email.com",
    },
  });

  return (
    <loginCredentials.Provider value={{ loginCred, setLoginCred }}>
      {children}
    </loginCredentials.Provider>
  );
};