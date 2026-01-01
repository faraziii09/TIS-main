import { useRef, useState } from "react";
import Button from "../../components/Button.jsx";
import { FaRandom, FaCamera } from "react-icons/fa"; // Added Camera icon for better UI
import axios from "../../axiosConfig.js";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import DefaultImg from "../../assets/user.png";

const AddEmployee = ({ activeTab, setActiveTab }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [values, setValues] = useState({
    displayName: "",
    username: "",
    password: "",
  });
  const fileInputRef = useRef();

  const handleInputDisplayName = (e) => {
    setValues({
      ...values,
      displayName: e.target.value,
      username: e.target.value?.toLowerCase()?.replaceAll(" ", ".")?.trim(),
    });
  };

  const handleInputUsername = (e) => {
    setValues({ ...values, username: e.target.value });
  };

  const handleInputPassword = (e) => {
    setValues({ ...values, password: e.target.value });
  };

  const setRandomPassword = () => {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 8) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    setValues({ ...values, password: result });
  };

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          url: e.target.result,
          file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const data = new FormData();
      data.append("displayName", values?.displayName);
      data.append("username", values?.username);
      data.append("role", values?.role); // Note: Role seems undefined in original code, might want to set a default
      data.append("password", values?.password);
      if (selectedImage) {
        data.append("file", selectedImage?.file);
      }
      await axios.post("/users", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setValues({ displayName: "", username: "", password: "" });
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast.success("User created successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    }
    setBtnLoading(false);
  };

  return (
    <div className={activeTab === "addEmployee" ? "slideDown max-w-4xl mx-auto mt-8" : "hidden"}>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Member</h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN: Image Upload */}
          <div className="flex flex-col items-center justify-start space-y-4 md:w-1/3">
            <div 
              className="relative group cursor-pointer w-32 h-32"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm group-hover:border-blue-100 transition-colors"
                src={selectedImage?.url || DefaultImg}
                alt="Profile"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="text-white text-xl" />
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Click to upload profile picture
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onInput={handleSelectImage}
              hidden
              accept="image/*"
            />
          </div>

          {/* RIGHT COLUMN: Form Inputs */}
          <div className="flex-1 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="text"
                placeholder="e.g. John Doe"
                name="displayName"
                value={values?.displayName || ""}
                onInput={handleInputDisplayName}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
                type="text"
                placeholder="john.doe"
                value={values?.username || ""}
                name="username"
                onInput={handleInputUsername}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  required
                  name="password"
                  minLength={8}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
                  type="text"
                  placeholder="Enter or generate password"
                  value={values?.password || ""}
                  onInput={handleInputPassword}
                />
                <FaRandom
                  onClick={setRandomPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors"
                  title="Generate Random Password"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            </div>

            <div className="pt-4">
              <Button
                props={{ 
                  className: "w-full md:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform active:scale-95", 
                  type: "submit", 
                  disabled: btnLoading 
                }}
              >
                {btnLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <CircularProgress size={18} style={{ color: "white" }} />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <span>Create Member</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;