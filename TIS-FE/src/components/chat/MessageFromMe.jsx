import moment from "moment";
import { useStateContext } from "../../ContextProvider";
import MessageMenu from "./MessageMenu";
import { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";

const MessageFromMe = ({ messageData, noMenu = false }) => {
  const { User } = useStateContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState({});
  
  const handleContextMenu = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget?.querySelector(".caret-down-icon"));
  };

  useEffect(() => {
    setData(messageData);
  }, [messageData]);

  return (
    <div
      onContextMenu={handleContextMenu}
      className="flex flex-col items-end mb-2 w-full group"
    >
      {/* HEADER: Date + Time (Above Bubble, Right Aligned) */}
      <div className="flex items-center mb-1 mr-1">
         <span className="text-[11px] text-gray-500">
            {moment(data?.createdAt).format("MMM D, h:mm A")}
         </span>
      </div>

      <div className="flex flex-col items-end max-w-[85%] relative">
        {/* BUBBLE: Light Blue #e3f2fd */}
        <div 
          className={`px-4 py-2 rounded-2xl rounded-tr-none text-[14px] leading-snug break-words shadow-sm
          bg-[#e3f2fd] text-[#1f1f1f]
          `}
        >
          {data?.type?.startsWith("image") ? (
            <img
              alt=""
              className="rounded-lg object-cover w-full mb-1"
              src={data?.file}
            />
          ) : data?.type !== "text" && data?.type !== "deleted" ? (
            <div className="flex flex-wrap flex-col items-center p-2 justify-center bg-white/50 rounded border border-blue-100">
              <FaFile size={20} className="text-blue-500"/>
              <p className="text-center mt-1 whitespace-pre-wrap text-xs font-medium">{data?.fileName}</p>
              <p onClick={() => window.open(data?.file)} className="cursor-pointer text-blue-700 underline text-xs mt-1">Download</p>
            </div>
          ) : null}

          <p className={`whitespace-pre-wrap ${data?.type === "deleted" && "italic opacity-80"}`}>
            {data?.content}
          </p>
        </div>
        
        {!noMenu && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-6 top-0">
            <MessageMenu data={data} setData={setData} anchorEl={anchorEl} setAnchorEl={setAnchorEl} forMe={true}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageFromMe;