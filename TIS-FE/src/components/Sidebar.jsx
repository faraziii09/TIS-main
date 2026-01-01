import {
  MdOutlineDashboard,
  MdSettings,
  MdOutlinePeople,
  MdPeople,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import SidebarItem from "./sidebar/SidebarItem";
import { FiSettings } from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";
import { useLocation } from "react-router";
import { MdOutlineChatBubbleOutline, MdChatBubble } from "react-icons/md";
import { useStateContext } from "../ContextProvider";
import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import Button from "./Button";
import { BiPowerOff } from "react-icons/bi";
import { Link } from "react-router-dom";
import { RxSize } from "react-icons/rx";

import DefaultImg from "../assets/user.png";
const Sidebar = () => {
  const location = useLocation();
  const [sidebarItems, setSidebarItems] = useState([]);
  const { User, sidebarShrunk, setSidebarShrunk } = useStateContext();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    document.location.href = "/";
  };

  const options = {
    size: 25,
    onClick: () => setSidebarShrunk(!sidebarShrunk),
    className: "cursor-pointer",
    style: { color: "#afafaf" },
  };

  const allSidebarItems = [
    {
      text: "Dashboard",
      link: "/dashboard",
      Icon: ({ size }) => <MdOutlineDashboard size={size} />,
      ActiveIcon: ({ size }) => (
        <RiDashboardFill className="text-primary" size={size} />
      ),
    },
    {
      text: "Team",
      link: "/employees",
      isAdmin: true,
      Icon: ({ size }) => <MdOutlinePeople size={size} />,
      ActiveIcon: ({ size }) => (
        <MdPeople className="text-primary" size={size} />
      ),
    },
    {
      text: "Chat",
      link: "/chat",
      Icon: ({ size }) => <MdOutlineChatBubbleOutline size={size} />,
      ActiveIcon: ({ size }) => (
        <MdChatBubble className="text-primary" size={size} />
      ),
    },
    {
      text: "Settings",
      link: "/settings",
      isAdmin: true,
      Icon: ({ size }) => <FiSettings size={size} />,
      ActiveIcon: ({ size }) => (
        <MdSettings className="text-primary" size={size} />
      ),
    },
  ];

  useEffect(() => {
    if (User) {
      setSidebarItems(
        User?.role === 1
          ? allSidebarItems
          : allSidebarItems?.filter((item) => !item?.isAdmin)
      );
    }
  }, [User]);
  return (
    <div
      className={`sticky border-r border-gray-200 flex flex-col justify-between shadow top-0 ${
        sidebarShrunk ? "w-max" : "w-[200px]"
      } h-screen`}
    >
      <div>
        <div
          className={`flex ${
            sidebarShrunk ? "justify-center" : "justify-end pr-3"
          } pt-2`}
        >
          {sidebarShrunk ? (
            <MdKeyboardDoubleArrowRight {...options} />
          ) : (
            <MdKeyboardDoubleArrowLeft {...options} />
          )}
        </div>
        <Link
          to={User?.role === 1 && "/settings"}
          className="flex pb-5 pt-2 items-center flex-col border-b border-[#d3d3d3] mt-1"
        >
          <div
            className={`image-container mx-2 transition-all ${
              sidebarShrunk ? "w-[45px] h-[45px]" : "w-[65px] h-[65px]"
            } shadow-lg`}
          >
            <img className="round-image" alt="" src={User?.profile_picture || DefaultImg} />
          </div>
          {!sidebarShrunk && (
            <p className="flex items-center mt-2">
              <strong className="mr-2">{User?.displayName}</strong>{" "}
              {User?.role === 1 && (
                <FaCrown style={{ color: "#FFD700" }} size={20} />
              )}
            </p>
          )}
        </Link>
        <div className="mt-5">
          {sidebarItems?.map((item) => {
            return (
              <SidebarItem
                sidebarShrunk={sidebarShrunk}
                active={location.pathname === item?.link}
                key={item?.link}
                {...item}
              >
                {item?.text}
              </SidebarItem>
            );
          })}
        </div>
      </div>

      {sidebarShrunk ? (
        <div className="flex justify-center items-center pb-8">
          <BiPowerOff
            onClick={handleLogout}
            size={24}
            className="font-bold cursor-pointer"
            color="#f10303a8"
          />
        </div>
      ) : (
        <Button
          style={{
            background: "#f10303a8",
            margin: "0 25px 30px 25px",
            padding: "10px 0",
          }}
          props={{
            className: "shadow",
          }}
          onClick={handleLogout}
        >
          <div className="flex items-center">
            <BiPowerOff className="mr-1" size={18} color="white" />
            Logout
          </div>
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
