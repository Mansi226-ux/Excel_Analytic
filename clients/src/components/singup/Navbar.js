import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileSpreadsheet } from "lucide-react";
import { useAnimations } from "../../hooks/useAnimations.js";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { slideLeft } = useAnimations();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <header
      className="border-b h-18 bg-white/80 backdrop-blur-sm   "
      style={slideLeft}
    >
      <div className="container mx-auto px-2 my-0 flex items-center justify-between animate-slide-down animate-delay-200">
        <div className="flex items-center my-4 space-x-2  ">
          <FileSpreadsheet className="h-8 w-8 text-indigo-600 animate-float" />

          <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">Excel Analytics</h1>
        </div>
        <div className="flex items-center space-x-4">
          {token ? (
            <button onClick={handleLogout} className=" Logout-btn">
              Logout{" "}
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
