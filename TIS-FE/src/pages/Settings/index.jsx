import Button from "../../components/Button";
import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../ContextProvider";
import Avatar from "../../assets/user.png";
import { toast } from "react-toastify";
import axios from "../../axiosConfig";
import { CircularProgress } from "@mui/material";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Settings = () => {
  const { User, setUser } = useStateContext();
  const [values, setValues] = useState({
    displayName: User?.displayName,
  });
  const [newPassword, setNewPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [changePwdBtnLoading, setChangePwdBtnLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    url: "",
    file: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef();

  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async (e) => {
      try {
        const data = new FormData();

        data.append("file", file);
        setLoading(true);
        const response = await axios.post("/upload-file", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setUser({ ...User, ...response.data?.data });
        toast.success("Profile Picture is updated!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fileInputRef.current.value = "";
        setSelectedImage({
          url: e.target.result,
          file,
        });
      } catch (error) {
        console.log(error);
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
      setLoading(false);
    };
  };

  const handleSubmit = async () => {
    try {
      setSaveBtnLoading(true);
      const response = await axios.post("/profile", JSON.stringify(values));
      setUser({ ...User, ...response.data?.data });
      toast.success("Settings updated!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
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
    setSaveBtnLoading(false);
  };

  const handleChangePassword = async () => {
    try {
      setChangePwdBtnLoading(true);
      await axios.post("/profile", JSON.stringify({ password: newPassword }));
      toast.success("Password updated!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
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
    setChangePwdBtnLoading(false);
  };

  useEffect(() => {
    if (Object.values(values)?.some((value) => !value)) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [values]);

  return (
    <div className="px-8 py-5 rounded min-h-screen">
      <strong className="text-2xl">Settings</strong>
      <p className="text-slate-500 text-sm">
        Update your bio & credentials etc
      </p>

      <div className="mt-8">
        {loading ? (
          <div className="mb-2">
            <CircularProgress size={24} color="success" />
          </div>
        ) : (
          <div className="mb-3 image-container w-[100px] h-[100px]">
            <img
              className="round-image"
              width={100}
              height={100}
              src={selectedImage?.url || User?.profile_picture || Avatar}
              alt="profile pic"
            />
          </div>
        )}

        <input onInput={handleUpload} ref={fileInputRef} type="file" />
      </div>
      <div className="mt-8">
        <h1 className="text-primary mb-2 font-bold uppercase text-xs">
          General
        </h1>
        <label htmlFor="displayName" className="block text-sm">
          Display Name
        </label>
        <input
          required
          value={values?.displayName}
          name="displayName"
          onInput={handleInput}
          className="border-[0.5px] w-3/12 border-gray-400 rounded-[4px] p-2"
          type="text"
        />

        <div className="mt-2">
          <Button
            onClick={handleSubmit}
            props={{
              disabled: isDisabled,
              className: "w-3/12",
            }}
          >
            {saveBtnLoading ? (
              <CircularProgress size={18} style={{ color: "white" }} />
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h1 className="text-primary mb-2 font-bold uppercase text-xs">
          Password
        </h1>

        <label htmlFor="password" className="block text-sm">
          New Password
        </label>
        <div className="relative w-3/12">
          {showPassword ? (
            <IoMdEyeOff
              onClick={() => setShowPassword(false)}
              className="absolute cursor-pointer right-3 top-[50%] -translate-y-[50%]"
            />
          ) : (
            <IoMdEye
              onClick={() => setShowPassword(true)}
              className="absolute cursor-pointer right-3 top-[50%] -translate-y-[50%]"
            />
          )}
          <input
            required
            value={newPassword}
            name="password"
            onInput={(e) => setNewPassword(e.target.value)}
            className="border-[0.5px] w-full border-gray-400 rounded-[4px] p-2"
            type={showPassword ? "text" : "password"}
          />
        </div>
        <div className="mt-2">
          <Button
            onClick={handleChangePassword}
            props={{
              disabled: !newPassword,
              className: "w-3/12",
            }}
          >
            {changePwdBtnLoading ? (
              <CircularProgress size={18} style={{ color: "white" }} />
            ) : (
              <span>Update</span>
            )}
          </Button>
        </div>
      </div>
      {/* <div className="mt-8">
        <h1 className="text-primary font-bold uppercase text-xs mb-2">Email</h1>
        <div className="flex">
          <div className="w-3/12 ">
            <label htmlFor="username" className="block">
              Primary
            </label>
            <input
          required
          value={values?.email}
          name="username"
          onInput={handleInput}
          className="border-[0.5px] w-3/12 border-gray-400 rounded-[4px] p-2"
          type="text"
        />
          </div>
          <div className="w-3/12 ml-10">
            <label htmlFor="username" className="block">
              Secondary
            </label>
            <TextInput></TextInput>
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default Settings;
