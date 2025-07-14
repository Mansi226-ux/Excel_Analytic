import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import ForgetPassword from "./pages/Forget-password.js";
import CreateNewPassword from "./pages/Create-new-password.js";
import ProtectedRoute from "./components/singup/ProtectedRoute.js";
import UserDashboard from "./pages/DashboardPage.js";
import UserUpload from "./dashboard/UserUpload.js";
import Admin from "./pages/AdminPage.js";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="Main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UserUpload />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
export default App;
