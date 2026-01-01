import { CircularProgress, IconButton } from "@mui/material";
import { VscSend } from "react-icons/vsc";
import { FaFile, FaRegSmile } from "react-icons/fa";
import { useRef, useState } from "react";
import EmojiBox from "./EmojiBox";
import { IoMdAttach } from "react-icons/io";
import { socket } from "../../App";
import { FaTimes } from "react-icons/fa";
import { useStateContext } from "../../ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axiosConfig";

const ChatFooter = () => {
  const [showEmojiBox, setShowEmojiBox] = useState(false);
  const [messageInputVal, setMessageInputVal] = useState("");
  const {
    User,
    messageBeingSent,
    setMessageBeingSent,
    replyMessage,
    setReplyMessage,
  } = useStateContext();
  const messageInputRef = useRef();
  const filePicker = useRef();
  const [fileBeingSent, setFileBeingSent] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    file: null,
    url: null,
  });

  const typing = useRef(false);
  const timeout = useRef(undefined);

  function insertEmoji(emoji) {
    const inputField = messageInputRef.current;
    var cursorPosition = inputField.selectionStart;

    var textBeforeCursor = inputField.value.substring(0, cursorPosition);
    var textAfterCursor = inputField.value.substring(cursorPosition);

    var updatedText = textBeforeCursor + emoji + textAfterCursor;

    inputField.value = updatedText;
    setMessageInputVal(updatedText);

    inputField.setSelectionRange(
      cursorPosition + emoji.length,
      cursorPosition + emoji.length
    );
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      if (selectedFile?.file) {
        setFileBeingSent(true);
        const formData = new FormData();
        formData.append("type", selectedFile?.file?.type);
        formData.append("content", messageInputVal);
        formData.append("from", User?._id);
        formData.append("fileName", selectedFile?.file?.name);
        formData.append("file", selectedFile?.file);

        await axios.post(
          `/sendFile?isReply=${replyMessage ? replyMessage?.from?._id : "false"
          }`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setFileBeingSent(false);

        setSelectedFile({
          file: null,
          url: null,
        });
      } else {
        const data = {
          message: {
            type: "text",
            content: messageInputVal,
            from: User?._id,
            recipients: [],
          },
          isReply: replyMessage ? replyMessage?.from?._id : false,
        };
        if (socket) {
          socket.emit("chat_send_message", data);
          setMessageBeingSent(true);
        }
      }
      setMessageInputVal("");
      setReplyMessage(null);
    } catch (error) {
      console.log(error);
      setFileBeingSent(false);
      handleUnSelectImage();
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
  };

  const handleSelectImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (data) => {
      setSelectedFile({
        file,
        url: data.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleInput = (e) => {
    setMessageInputVal(e.target.value);

    function timeoutFunction() {
      typing.current = false;
    }

    if (typing.current == false) {
      typing.current = true;
      socket.emit("chat_is_typing", User?.displayName);
      timeout.current = setTimeout(timeoutFunction, 5000);
    } else {
      clearTimeout(timeout);
      timeout.current = setTimeout(timeoutFunction, 5000);
    }
  };

  const handleUnSelectImage = () => {
    setSelectedFile({
      file: null,
      url: null,
    });
    filePicker.current.value = "";
  };

  return (
    // GOOGLE CHAT FIX: Full width container, white bg, top border
    <div className="chat-footer w-full bg-white border-t border-gray-200 p-4 relative">
      <form
        onSubmit={handleSendMessage}
        // GOOGLE CHAT FIX: Gray Pill shape (#f1f3f4), full width, rounded-3xl
        className="w-full bg-[#f1f3f4] flex relative items-center justify-between rounded-[24px] px-2 py-1 transition-shadow focus-within:shadow-sm"
      >
        {/* File Preview Popup */}
        {!!selectedFile?.file && (
          <div className="absolute -translate-y-[120%] left-0 bottom-0 rounded-lg bg-white shadow-xl border border-gray-200 p-3 z-50">
            {selectedFile?.file?.type?.startsWith("image") ? (
              <img
                alt=""
                src={selectedFile?.url}
                width={200}
                className="object-contain rounded"
              />
            ) : (
              <div className="flex flex-wrap p-4 items-center justify-center flex-col">
                <FaFile size={30} className="text-gray-500" />
                <p className="text-center mt-2 text-xs text-gray-700 whitespace-pre-wrap max-w-[150px] truncate">
                  {selectedFile?.file?.name}
                </p>
              </div>
            )}
            <div 
              onClick={!fileBeingSent && handleUnSelectImage}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 cursor-pointer hover:bg-red-600 text-white shadow-sm"
            >
              <FaTimes size={12} />
            </div>
          </div>
        )}

        {/* Left Actions: Attach */}
        <div className="flex items-center">
            {!selectedFile?.file && (
            <IconButton
                onClick={() => filePicker.current?.click()}
                size="small"
                className="text-gray-500 hover:bg-gray-200"
            >
                <div className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors">
                    <IoMdAttach size={20} className="text-gray-600" />
                </div>
            </IconButton>
            )}
            <input
            type="file"
            multiple={false}
            onInput={handleSelectImage}
            hidden
            ref={filePicker}
            />
        </div>

        {/* Input Field */}
        <input
          ref={messageInputRef}
          className="flex-1 mx-3 bg-transparent text-gray-800 placeholder-gray-500 outline-none text-sm h-10"
          placeholder="History is on" // Google Chat default placeholder
          value={messageInputVal}
          onInput={handleInput}
        />

        {/* Right Actions: Emoji & Send */}
        <div className="flex items-center gap-1">
            <IconButton
            onClick={() => setShowEmojiBox(!showEmojiBox)}
            size="small"
            className="text-gray-500"
            >
            <FaRegSmile size={20} />
            </IconButton>

            {fileBeingSent || messageBeingSent ? (
            <CircularProgress size={20} style={{ color: "#1b72e8" }} />
            ) : (
            <IconButton type="submit" size="small" disabled={!messageInputVal && !selectedFile.file}>
                <VscSend 
                    size={22} 
                    className={`${messageInputVal || selectedFile.file ? "text-[#1b72e8]" : "text-gray-400"} transition-colors`} 
                />
            </IconButton>
            )}
        </div>
      </form>

      {/* Emoji Picker Positioned Absolute */}
      {showEmojiBox && (
        <div className="absolute bottom-20 right-4 z-50 shadow-2xl rounded-lg">
            <EmojiBox
            insertEmoji={insertEmoji}
            showEmojiBox={showEmojiBox}
            handleClose={() => setShowEmojiBox(false)}
            />
        </div>
      )}
    </div>
  );
};

export default ChatFooter;