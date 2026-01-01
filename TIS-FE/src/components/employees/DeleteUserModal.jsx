import { useState } from "react";
import {
  Modal,
  Backdrop,
  IconButton,
  Button as MuiButton,
  CircularProgress,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";
import { toast } from "react-toastify";
import axios from "../../axiosConfig";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const DeleteUserModal = ({ deleteUserModal = {}, handleClose, fetchUsers }) => {
  const [btnloading, setbtnloading] = useState(false);

  const handleDeleteUser = async () => {
    try {
      setbtnloading(true);
      const response = await axios.delete("/users/" + deleteUserModal?.userID);
      toast.success(response.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchUsers();
      handleClose();
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setbtnloading(false);
  };
  return (
    <Modal
      keepMounted
      open={deleteUserModal?.isOpen}
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
        className={`w-[calc(100%-20px)] md:w-[30%] bg-white absolute top-1/2 left-1/2 px-5 py-12 rounded-md`}
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

        <h1 className="text-lg text-center">
          Do you really want to delete this user?
        </h1>
        <div className="mt-5 flex items-center justify-center space-x-2">
          <MuiButton
            onClick={handleClose}
            ripple="true"
            variant="outlined"
            className={`shadow-none  rounded-md text-sm text-black`}
          >
            Cancel
          </MuiButton>
          <Button
            style={{
              color: "white",
            }}
            onClick={handleDeleteUser}
          >
            {btnloading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              <span>Confirm</span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
