import { CircularProgress, IconButton } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";
import axios from "../axiosConfig";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import DefaultImg from "../assets/user.png";

const UserCard = ({ data, onClick, className, width, type = "", fetchFlows }) => {
  const [btnloading, setbtnloading] = useState(false);
  const [displayNames, setDisplayNames] = useState([]);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        if (data?._id) {
          const response = await axios.get("/flows/" + data._id);
          const names = response.data.data.recipients.map(recipient => recipient.displayName);
          setDisplayNames(names);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecipients();
  }, [data?._id]);



  const deleteFlow = async () => {
    try {
      setbtnloading(true);
      const response = await axios.delete("/flows/" + data?._id);
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
      fetchFlows();
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
    <div
      onClick={(e) => {
        if (!e.target.closest(".delete-btn")) {
          onClick();
        }
      }}
      style={{ width: width + "%" }}
      className={`bg-[#e7e7e7] shadow cursor-pointer rounded justify-between py-3 flex items-center pl-4 ${type === "flow" ? "pr-3" : "pr-8"
        } ${className}`}
    >
      <div className="flex items-center" >
        <div className="w-[60px] mr-4 h-[60px] image-container">
          <img
            src={data?.profile_picture || DefaultImg}
            className="round-image stroke-black"
            alt="profile pic"
          />
        </div>
        <div>
          <div className="flex items-center">
            <strong className="mr-1"> {data?.displayName}</strong>
            <small>@{data?.username}</small>
          </div>
          <div style={{display:"flex", flexWrap:"wrap", width: "90%"}}>
            {displayNames.map((name, index) => (<div style={{margin: "1%", backgroundColor: "black", padding: "2%", color: "white"}} key={index}>{name}</div>))}
          </div>
        </div>
      </div>
      {type === "flow" &&
        (btnloading ? (
          <CircularProgress className="mr-2" size={18} />
        ) : (
          <IconButton className="delete-btn" onClick={deleteFlow}>
            <FaTrashAlt size={18} style={{ color: "red" }} />
          </IconButton>
        ))}
    </div>
  );
};

export default UserCard;
