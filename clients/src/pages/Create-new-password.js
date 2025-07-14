import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import { toast, ToastContainer } from "react-toastify";

import { useAnimations } from "../hooks/useAnimations.js";

function CreateNewPassword() {
  const {slideRight } = useAnimations();
  const [params] = useSearchParams();
  const [password, setPassword] = useState();
  const location = useLocation();
  let queryParameters = new URLSearchParams(location.search);
  const createNewPassword = (event) => {
    event.preventDefault();
    let email = queryParameters.get("email");
    console.log(email);
    axios
      .post(api.create_new_password, { email, password })
      .then((response) => {
        toast.success("Password updated | please sign-in again");
      })
      .catch((err) => {
        toast.error("Oops! something went wrong | please try after sometimes");
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
            <h2 className="text-2xl font-bold">Change Password</h2>
            <p className="text-gray-600 mt-1">
              Provide the email address associated with your account to recover
              your password.
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={createNewPassword} className="space-y-4">
              <div className="space-y-2">
                <input
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="block text-sm font-medium text-gray-700"
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  style={{ width: "100%" }}
                >
                  change password
                </button>
              </div>
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

export default CreateNewPassword;
