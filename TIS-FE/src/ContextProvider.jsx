import { createContext, useContext, useState } from "react";

const DataContext = createContext({});

// eslint-disable-next-line react/prop-types
export const ContextProvider = ({ children }) => {
  const [User, setUser] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState(0);
  const [sidebarShrunk, setSidebarShrunk] = useState(false);
  const [bgImg, setBgImg] = useState("");
  const [replyMessage, setReplyMessage] = useState(null);
  const [weather, setWeather] = useState(null);
  const [messageBeingSent, setMessageBeingSent] = useState(false);
  const [BACKEND_URL] = useState(import.meta.env.VITE_BACKEND_URL);
  return (
    <DataContext.Provider
      value={{
        User,
        setUser,
        BACKEND_URL,
        receivedMessages,
        setReceivedMessages,
        messageBeingSent,
        setMessageBeingSent,
        sidebarShrunk, 
        setSidebarShrunk, 
        weather, setWeather, 
        bgImg, setBgImg, 
        replyMessage, setReplyMessage
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(DataContext);
