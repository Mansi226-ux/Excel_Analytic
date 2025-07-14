import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api.js";
import { toast, ToastContainer } from "react-toastify";
import { useAnimations } from "../hooks/useAnimations.js";

function ForgetPassword() {
  const { slideRight } = useAnimations();
  const [email, setEmail] = useState();
  const recoverPassword = (event) => {
    event.preventDefault();
    axios
      .post(api.forget_password, { email })
      .then((response) => {
        toast.success("Please check your email for creating new password");
      })
      .catch((err) => {
        toast.error("Oops! something went wrong or contact to customer care");
      });
  };
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-200 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white rounded-lg shadow-md/100"
          style={slideRight}
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
            <h2 className="text-2xl font-bold">Password Reset</h2>
            <p className="text-gray-600 mt-1">
              Provide the email address associated with your account to recover
              your password.
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={recoverPassword} className="space-y-4">
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
                    onChange={(event) => setEmail(event.target.value)}
                    className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Recover Password
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{""}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;
