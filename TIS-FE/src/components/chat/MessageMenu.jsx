import { RxCaretDown } from "react-icons/rx";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoMdTrash } from "react-icons/io";
import { FaCopy } from "react-icons/fa";
import { TiArrowForward } from "react-icons/ti";
import { useState } from "react";
import ForwardMessageModal from "./ForwardMessageModal";
import { socket } from "../../App";
import { toast } from "react-toastify";
import {MdOutlineReply } from "react-icons/md";
import { useStateContext } from "../../ContextProvider";

export default function MessageMenu({
  forMe,
  setData,
  anchorEl,
  setAnchorEl,
  data,
}) {
  const open = Boolean(anchorEl);
  const {User, primaryColor, setReplyMessage, replyMessage} = useStateContext();
  const [forwardMessageModal, setForwardMessageModal] = useState({
    isOpen: false,
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleForward = () => {
    setForwardMessageModal({
      isOpen: true,
      data,
      forMe,
    });
    handleClose();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(data?.content || "");
    handleClose();
  };

  const handleDelete = () => {
    if (socket) {
      socket.emit("chat_delete_message", data?._id);

      socket.on("chat_delete_message_failed", (status) => {
        if (String(status) === "true") {
          toast.error("Something went wrong, try again please!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
      handleClose();
    }
  };

  const handleReply = () => {
    setReplyMessage(data);
    handleClose();
  }
  return (
    <>
      <div>
        <RxCaretDown
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          className="cursor-pointer caret-down-icon"
          size={28}
          style={{ color: "white" }}
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          sx={{
            "& .MuiMenu-list": {
              padding: "5px 0",
            },
          }}
          anchorOrigin={
            forMe && {
              vertical: "top",
              horizontal: "right",
            }
          }
          transformOrigin={
            forMe && {
              vertical: "top",
              horizontal: "right",
            }
          }
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
        {!!(User?.role === 1) &&
          <MenuItem
            onClick={handleForward}
            className="flex items-center text-green-500"
          >
            <TiArrowForward size={20} style={{ color: "green" }} />{" "}
            <p className="ml-2 pr-4 mb-0 font-medium text-sm">Forward</p>
          </MenuItem>
        }

          {!!(User?.role !== 1) &&
          <MenuItem
            onClick={handleReply}
            className="flex items-center text-primary"
          >
            <MdOutlineReply  size={20} style={{ color: primaryColor }} />{" "}
            <p className="ml-2 pr-4 mb-0 font-medium text-sm">Reply</p>
          </MenuItem>
        }
          <MenuItem
            onClick={handleCopyText}
            className="flex items-center text-red-500"
          >
            <FaCopy size={16} style={{ color: "black" }} />{" "}
            <p className="ml-2 pr-4 mb-0 font-medium text-sm">Copy Text</p>
          </MenuItem>

          {!!(User?.role === 1) &&
          <MenuItem
            onClick={handleDelete}
            className="flex items-center text-red-500"
          >
            <IoMdTrash size={20} style={{ color: "red" }} />{" "}
            <p className="ml-2 pr-4 mb-0 font-medium text-sm">Delete</p>
          </MenuItem>
          }
        </Menu>
      </div>

      {forwardMessageModal?.isOpen && (
        <ForwardMessageModal
          setData={setData}
          forwardMessageModal={forwardMessageModal}
          handleClose={() => setForwardMessageModal({ isOpen: false })}
        />
      )}
    </>
  );
}
