import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../axiosConfig";
import { useStateContext } from "../../ContextProvider";
import { socket } from "../../App";
import { IoMdEye, IoMdSearch, IoMdClose } from "react-icons/io";
import OnlineUsersModal from "./OnlineUsersModal";

const ChatHeader = ({ onSearch }) => {
  const { User } = useStateContext();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState("");
  const [onlineUsersModal, setOnlineUsersModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const fetchOnlineUsers = async () => {
    try {
      const response = await axios.get("/users?online=1");
      const onlineUsers = response?.data?.data;
      setOnlineUsers(onlineUsers);

      if (socket) {
        socket.on("chat_getOnlineUsers", (users) => {
          setOnlineUsers(users);
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-right",
        theme: "light",
      });
    }
  };

  const handleShowOnlineUsers = () => {
    setOnlineUsersModal(true);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearchQuery(val);
    onSearch(val); // Send to parent
  };

  const clearSearch = () => {
    setShowSearch(false);
    setLocalSearchQuery("");
    onSearch(""); // Reset parent
  };

  useEffect(() => {
    if (User?.role === 1) {
      fetchOnlineUsers();
      if (socket) {
        let timeout = null;
        const cb = () => { setIsTyping(""); timeout = null; };
        socket.on("chat_is_typing", (username) => {
          setIsTyping(username);
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(cb, 3000);
        });
      }
    }
  }, []);

  return (
    <>
      <div className="chat-header h-[64px] bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center flex-1">
          {showSearch ? (
            <div className="flex items-center w-full bg-gray-100 rounded-lg px-3 py-1 mr-4">
              <IoMdSearch className="text-gray-500 mr-2" size={20} />
              <input
                type="text"
                placeholder="Search in chat"
                className="bg-transparent border-none outline-none text-sm w-full h-8 text-gray-700 placeholder-gray-500"
                value={localSearchQuery}
                onChange={handleSearchChange}
                autoFocus
              />
              <IconButton size="small" onClick={clearSearch}>
                <IoMdClose size={18} />
              </IconButton>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg text-gray-800 leading-tight">Chat Group</span>
                {User?.role === 1 && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {onlineUsers?.length} ONLINE
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 h-4 flex items-center">
                {isTyping ? (
                  <span className="text-green-600 font-medium animate-pulse">{isTyping} is typing...</span>
                ) : (
                  User?.role === 1 && <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span><span>Active</span></div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!showSearch && (
            <Tooltip title="Search messages">
              <IconButton onClick={() => setShowSearch(true)} className="text-gray-500 hover:bg-gray-100">
                <IoMdSearch size={22} />
              </IconButton>
            </Tooltip>
          )}
          {User?.role === 1 && (
            <Tooltip title="View Online Users">
              <IconButton onClick={handleShowOnlineUsers} className="text-gray-500 hover:bg-gray-100">
                <IoMdEye size={22} />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>

      {!!onlineUsersModal && (
        <OnlineUsersModal
          onlineUsers={onlineUsers}
          onlineUsersModal={onlineUsersModal}
          handleClose={() => setOnlineUsersModal(false)}
        />
      )}
    </>
  );
};

export default ChatHeader;