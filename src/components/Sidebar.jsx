import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname

  const { user, setUser, setRefreshToken, setAccessToken } = useAuth();

  const handleLogout = async () => {

    try {
      const url = import.meta.env.VITE_BACKEND_URL + '/users/logout';

      await axios.post(url, { id: user.id }, {
        headers: {
          "Content-Type": "application/json"
        }
      }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  if(!user){
    return null;
  }

  return (
    <div className="w-64 bg-[#B2BEFF] h-screen pt-5 flex flex-col fixed text-white">
      <div className="flex flex-col items-center mt-8">
        <div className="w-28 h-28 flex items-center justify-center text-xl font-bold">
          <img src="/assets/LogoText.png" alt="Logo" />

        </div>
      </div>

      <nav className="flex flex-col gap-4 mt-12 text-black">
        <Link to="/" className={`flex items-center gap-4 cursor-pointer rounded-md p-2 pl-4 group ${currentPath === "/" ? "bg-[#874C96] text-white rounded-l-full" : "hover:text-white hover:bg-[#874C96] hover:rounded-l-full"}`}>
          <img src="/assets/dasboard.svg" alt="" className={`w-6 h-6 child group-hover:invert ${currentPath === "/" ? "invert" : ""}`} />
          <span className="text-xl">Dashboard</span>
        </Link>
        <Link to="/twatch-ai" className={`flex items-center gap-4 cursor-pointer group rounded-md p-2 pl-4 ${currentPath === "/twatch-ai" ? "bg-[#874C96] text-white rounded-l-full" : "hover:text-white hover:bg-[#874C96] hover:rounded-l-full"}`}>
          <img src="/assets/plus-svgrepo-com.svg" alt="" className={`w-6 h-6 child group-hover:invert ${currentPath === "/twatch-ai" ? "invert" : ""}`} />
          <span className="text-xl">Twatch AI</span>
        </Link>
        <Link to="/patients" className={`flex items-center gap-4 group cursor-pointer rounded-md p-2 pl-4 ${currentPath === "/patients" ? "bg-[#874C96] text-white rounded-l-full" : "hover:text-white hover:bg-[#874C96] hover:rounded-l-full"}`}>
          <img src="/assets/Patients.svg" alt="" className={`w-6 h-6 child group-hover:invert ${currentPath === "/patients" ? "invert" : ""}`} />
          <span className="text-xl">Patients</span>
        </Link>
        <Link to="/chat" className={`flex items-center group gap-4 cursor-pointer rounded-md p-2 pl-4 ${currentPath.includes("/chat") ? "bg-[#874C96] text-white rounded-l-full" : "hover:text-white hover:bg-[#874C96] hover:rounded-l-full"}`}>
          <img src="/assets/chat-svgrepo-com.svg" alt="" className={`w-6 h-6 child group-hover:brightness-0 group-hover:saturate-100 group-hover:invert ${currentPath.includes("/chat") ? "brightness-0 saturate-100 invert" : ""}`} />
          <span className="text-xl">Chat</span>
        </Link>
      </nav>
      <div className="flex flex-col gap-4 m-auto">
        <div className="w-full h-20 items-center justify-center ">
          <img src="https://picsum.photos/800" alt="" className="w-20 h-20 rounded-full mx-auto" />
        </div>
          <p className="text-black text-lg font-bold">{user?.name || "Username"}</p>

        <button onClick={handleLogout} className=" px-4 py-2 rounded-full bg-[#6383FF] cursor-pointer text-md">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
