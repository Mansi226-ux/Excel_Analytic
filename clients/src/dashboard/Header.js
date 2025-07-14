import { FileSpreadsheet, Users } from "lucide-react";
import AnimatedButton from "../components/singup/AnimatedButton.js";
import { useAnimations } from "../hooks/useAnimations.js";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { slideUp } = useAnimations();
  const userEmail = localStorage.getItem("email") || "user@example.com";

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <header className="bg-white border-b shadow-sm" style={slideUp}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 animate-slide-right">
          <FileSpreadsheet className="h-8 w-8 text-indigo-600 animate-float" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
            Analytics Dashboard
          </h1>
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
            3D Mode
          </span>
        </div>
        <div className="flex items-center space-x-4 animate-slide-left">
          <button className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 flex items-center transition-all duration-200 hover-lift">
            <Users className="h-7 w-7 mr-2" />
            {userEmail.split("@")[0]}!
          </button>
          <AnimatedButton
            onClick={handleLogout}
            variant="outline"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            }
          >
            Logout
          </AnimatedButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
