import { useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAnimations } from "../hooks/useAnimations.js";

const Login = () => {
  const { slideLeft } = useAnimations();
  const navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let email = emailInput.current.value.trim();
    let password = passwordInput.current.value.trim();
    axios
      .post(api.login, { email, password })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("email", response.data.user.email);
        const role = response.data.role.trim().toLowerCase();
        navigate(role === "admin" ? "/admin" : "/dashboard");
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Invalid email or password");
        console.error(err);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-200 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white rounded-lg shadow-md/100"
          style={slideLeft}
        >
          <div className="text-center p-6 border-b">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M8 13h2"></path>
                <path d="M8 17h2"></path>
                <path d="M14 13h2"></path>
                <path d="M14 17h2"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-gray-600 mt-1">
              Sign in to your Excel Analytics Account
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    ref={emailInput}
                    className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    ref={passwordInput}
                    className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link
                to="/forget-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot your password?
              </Link>
              <p className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link
                  to="/register"
                  className="text-indigo-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
