import { Card, CircularProgress } from "@mui/material";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import axios from "../axiosConfig.js";
import { toast } from "react-toastify";
import Loader from "../components/utils/Loader.jsx";
import Logo from "../assets/logo.png";

const Auth = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setBtnLoading(true);
      const response = await axios.post(
        "/login",
        JSON.stringify({
          username: formValues?.username,
          password: formValues?.password,
        })
      );

      if (response.data?.status) {
        const token = response.data?.token;
        localStorage.setItem("auth-token", token);
        document.location.href = "/dashboard";
      } else {
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
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    setBtnLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      document.location.href = "/dashboard";
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader color="black" />;
  }
  return (
    <div className="bg-[#F1EFEF] w-screen h-screen flex justify-center items-center">
      <Card elevation={3} className="auth-card">
        <form
          action="#"
          onSubmit={handleLogin}
          className="w-[70%] mx-auto flex flex-col items-center"
        >
          <img width={60} height={60} src={Logo} />
          <h1 className="text-2xl mb-1 text-center">Log in to your account</h1>
          <p className="text-xs mb-8 text-center">
            Please enter your credentials!
          </p>
          <TextInput
            required
            onChange={(e) =>
              setFormValues({ ...formValues, username: e.target.value })
            }
            type="text"
            placeholder="Username"
          />
          <div className="mb-2.5"></div>
          <TextInput
            required
            onChange={(e) =>
              setFormValues({ ...formValues, password: e.target.value })
            }
            type="password"
            placeholder="Password"
          />
          <Button
            type="primary"
            style={{ marginTop: "10px", padding: "10px" }}
            props={{ fullWidth: true, type: "submit" }}
          >
            {btnLoading ? (
              <CircularProgress style={{ color: "white" }} size={20} />
            ) : (
              <span>Login</span>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Auth;