import { Modal, Backdrop, IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import UserCard from "../UserCard";
import NothingHere from "../../assets/nothing_here.png";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const OnlineUsersModal = ({ onlineUsersModal, onlineUsers, handleClose }) => {
  return (
    <Modal
      keepMounted
      open={onlineUsersModal}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div
        style={style}
        className={`w-[calc(100%-20px)] md:w-[70%] overflow-y-scroll h-[70%] bg-white absolute top-1/2 left-1/2 px-5 pt-8 pb-6 rounded-md`}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 7,
            top: 10,
            color: "black",
          }}
          onClick={handleClose}
        >
          <IoMdClose size={18} />
        </IconButton>

        <h1 className="text-2xl font-bold text-center mt-4 mb-3">Online</h1>

        {!!(onlineUsers?.length === 0) && (
          <div className="flex items-center h-[70%] justify-center text-gray-500 font-bold">
          <div className="flex items-center text-center flex-col">
            <img alt="" src={NothingHere} width={"70%"}/>
              <p className="relative -top-[50px]">No one is Online at the moment.</p>
          </div>
          </div>
        )}
        <div className="flex mt-5 flex-wrap gap-2">
          {onlineUsers?.map((user) => (
            <UserCard key={user?._id} data={user} width={48} />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default OnlineUsersModal;
