import { useEffect, useRef, useState } from "react";
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
import { FaRandom } from "react-icons/fa";

import axios from "../../axiosConfig";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const UpdateUserModal = ({ updateUserModal = {}, handleClose, fetchUsers }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [btnloading, setbtnloading] = useState(false);
  const [values, setValues] = useState({
    displayName: "",
    username: "",
    password: "",
  });
  const fileInputRef = useRef();
  const handleInputPassword = (e) => {
    setValues({ ...values, password: e.target.value });
  };
  const setRandomPassword = () => {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    setValues({ ...values, password: result });
  };
  const handleInputUsername = (e) => {
    setValues({ ...values, username: e.target.value });
  };
  const handleInputDisplayName = (e) => {
    setValues({
      ...values,
      displayName: e.target.value,
    });
  };

  const handleSelectImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      setSelectedImage({
        url: e.target.result,
        file,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setbtnloading(true);

      const data = new FormData();
      data.append("displayName", values?.displayName);
      data.append("username", values?.username);
      data.append("password", values?.password);

      if (selectedImage?.file) {
        data.append("file", selectedImage?.file);
      }
      const response = await axios.post(
        "/users/" + updateUserModal?.data?._id,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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

  useEffect(() => {
    const { displayName, username, password, profile_picture } =
      updateUserModal?.data || {};
    setValues({
      displayName,
      username,
      password,
    });
    setSelectedImage({ url: profile_picture });
  }, [updateUserModal?.data]);
  return (
    <Modal
      keepMounted
      open={updateUserModal?.isOpen}
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

        <h1 className="text-lg text-center">Update Team Member Details</h1>
        <form onSubmit={handleSubmit} action="">
          <h1 className="text-primary mt-5 mb-2 font-bold uppercase text-xs">
            Profile pic
          </h1>
          {selectedImage && (
            <div className="mb-3 image-container w-[100px] h-[100px]">
              <img
                className="round-image stroke-black"
                width={100}
                src={selectedImage?.url}
                height={100}
                alt="profile pic"
              />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onInput={handleSelectImage}
            className="mt-2"
          />

          <h1 className="text-primary mt-6 mb-2 font-bold uppercase text-xs">
            Other details
          </h1>

          <label className="block text-sm mt-4">Display Name</label>
          <input
            className="border-[0.5px] w-full border-gray-400 rounded-[4px] p-2"
            type="text"
            name="displayName"
            value={values?.displayName || ""}
            onInput={handleInputDisplayName}
            required
          />

          <label className="block text-sm mt-3">User ID</label>

          <input
            className="border-[0.5px] w-full border-gray-400 rounded-[4px] p-2"
            type="text"
            value={values?.username || ""}
            name="username"
            onInput={handleInputUsername}
            required
          />
          <label className="block text-sm mt-3">Password</label>

          <div className="relative w-full">
            <FaRandom
              onClick={setRandomPassword}
              className="absolute cursor-pointer right-3 top-[50%] -translate-y-[50%]"
            />

            <input
              required
              name="password"
              maxLength={6}
              className="border-[0.5px] w-full border-gray-400 rounded-[4px] p-2"
              type="text"
              value={values?.password || ""}
              onInput={handleInputPassword}
            />
          </div>

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
              props={{
                type: "submit",
              }}
            >
              {btnloading ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <span>Update</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateUserModal;
