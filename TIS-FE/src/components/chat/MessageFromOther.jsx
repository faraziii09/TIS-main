import moment from "moment";
import { useStateContext } from "../../ContextProvider";
import { useEffect, useState } from "react";
import MessageMenu from "./MessageMenu";
import UserCard from "../UserCard";
import DefaultImg from "../../assets/user.png";
import { FaFile, FaDownload } from "react-icons/fa"; 
import { Tooltip } from "@mui/material";

const MessageFromOther = ({ messageData, noMenu = false, onDownloadChat }) => {
  const { User } = useStateContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [fromDetails, setFromDetails] = useState(false);
  const [data, setData] = useState({});

  const handleContextMenu = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget?.querySelector(".caret-down-icon"));
  };

  useEffect(() => setData(messageData), [messageData]);

  const handleHoverUserAvatar = () => {
    setFromDetails(true);
  };

  return (
    <div className="flex items-start mb-2 w-full group relative hover:bg-gray-50 p-1 rounded transition-colors">
      
      {/* AVATAR */}
      <div
        onMouseEnter={handleHoverUserAvatar}
        onMouseLeave={() => setFromDetails(false)}
        className="flex-shrink-0 cursor-pointer mr-3 mt-1"
      >
        <img
          src={data?.from?.profile_picture || DefaultImg}
          className="w-9 h-9 rounded-full object-cover border border-gray-100"
          alt="User"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col max-w-[85%]">
        
        {/* HEADER: Name + Time + DOWNLOAD */}
        <div className="flex items-center mb-1">
            <span className="font-bold text-[13px] text-gray-900 mr-2">
               {data?.from?.displayName}
            </span>
            <span className="text-[11px] text-gray-500 mr-2">
               {moment(data?.createdAt).format("MMM D, h:mm A")}
            </span>

            {/* DOWNLOAD ICON (Admin Only) */}
            {User?.role === 1 && (
              <Tooltip title={`Download full history for ${data?.from?.displayName}`} arrow>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadChat(data?.from?._id, data?.from?.displayName);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-full flex items-center justify-center"
                >
                  <FaDownload size={11} />
                </div>
              </Tooltip>
            )}
        </div>

        {/* BUBBLE */}
        <div
            onContextMenu={handleContextMenu}
            className={`relative px-4 py-2 rounded-2xl rounded-tl-none text-[14px] leading-snug break-words
            bg-[#f2f2f2] text-[#1f1f1f]
            `}
        >
            {data?.type?.startsWith("image") ? (
            <img
                alt=""
                className="my-1 max-w-full rounded-lg object-cover cursor-pointer hover:opacity-95"
                src={data?.file}
                onClick={() => window.open(data?.file)}
            />
            ) : data?.type !== "text" && data?.type !== "deleted" ? (
            <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200">
                <FaFile size={14} className="text-gray-500" />
                <div className="flex flex-col">
                  <p className="truncate text-xs font-medium max-w-[150px]">{data?.fileName}</p>
                  <p onClick={() => window.open(data?.file)} className="cursor-pointer text-blue-600 text-[10px] font-bold">DOWNLOAD</p>
                </div>
            </div>
            ) : null}

            {data?.content && (
            <p className={`whitespace-pre-wrap ${data?.type === "deleted" ? "italic text-gray-500" : ""}`}>
                {data?.content}
            </p>
            )}

            {!noMenu && (
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MessageMenu data={data} setData={setData} setAnchorEl={setAnchorEl} anchorEl={anchorEl} />
            </div>
            )}
        </div>
      </div>

      {fromDetails && (
        <div className="bg-white z-[100] rounded-lg absolute top-8 left-0 shadow-xl border border-gray-100 p-1">
          <UserCard data={data?.from} />
        </div>
      )}
    </div>
  );
};

export default MessageFromOther;