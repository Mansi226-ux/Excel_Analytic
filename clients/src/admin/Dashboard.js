import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Users } from "lucide-react";
import AnimatedCard from "../components/singup/AnimatedCard.js";
import AnimatedButton from "../components/singup/AnimatedButton.js";
import { useAnimations } from "../hooks/useAnimations.js";
import api from "../services/api.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaUsers,
  FaRegChartBar,
  FaRegFileImage,
  FaUserCircle,
} from "react-icons/fa";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [charts, setCharts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [userCharts, setUserCharts] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [activeTab, setActiveTab] = useState("files");
  const { slideRight, slideLeft } = useAnimations();
  const totalUsers = users.length;
  const totalFiles = files.length;
  const totalCharts = charts.length;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, fileRes, chartsRes, insightsRes] = await Promise.all([
          axios.get(api.all_users, { headers }),
          axios.get(api.all_files, { headers }),
          axios.get(api.all_charts, { headers }),
           
        ]);

        setUsers(userRes.data.users);
        setFiles(fileRes.data.files);
        setCharts(chartsRes.data.charts);
         
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };
    fetchData();
  }, []);

  const userFileData = useMemo(() => {
    return users.map((user) => {
      const userId = user._id?.toString();
      const fileCount = files.filter(
        (f) => f.userId?.toString() === userId
      ).length;
      return {
        name: user.name || user.email,
        fileCount,
      };
    });
  }, [users, files]);

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    setLoadingUserData(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [fileRes, chartRes] = await Promise.all([
        axios.get(`http://localhost:3000/admin/files/user/${user._id}`, {
          headers,
        }),
        axios.get(`http://localhost:3000/admin/charts/user/${user._id}`, {
          headers,
        }),
      ]);

      setUserFiles(fileRes.data.files);
      setUserCharts(chartRes.data.charts);
    } catch (err) {
      console.error("Error loading user data:", err);
      setUserFiles([]);
      setUserCharts([]);
    }

    setLoadingUserData(false);
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/admin/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Delete user failed:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800 dark:text-gray-100 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <section
        className="container mx-auto px-4 py-12 text-center "
        style={slideRight}
      >
        <div className="max-w-4xl mx-auto  ">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-300 to-purple-500 bg-clip-text text-transparent mb-6  ease-in ">
            Monitor platform usage, data activity, and chart generation trends
            all in one dashboard.
          </h2>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 px-25">
        <AnimatedCard
          className="bg-white h-30 dark:bg-gray-800 animate-fade-in-up delay-100"
          style={slideRight}
        >
          <div className="text-center p-4 bg-blue-50 h-23 border-t border-blue-300">
            <h3 className="text-lg font-semibold">👤 Active Users</h3>
            <p className="text-3xl font-extrabold mt-2 text-indigo-600 dark:text-indigo-400">
              {totalUsers}
            </p>
          </div>
        </AnimatedCard>
        <AnimatedCard
          className="bg-white h-30 dark:bg-gray-800 animate-fade-in-up delay-200"
          style={slideRight}
        >
          <div className="text-center p-4 bg-blue-50 h-23  border-t border-blue-300">
            <h3 className="text-lg font-semibold">📁 Uploaded Files</h3>
            <p className="text-3xl font-extrabold mt-2 text-blue-600 dark:text-blue-400">
              {totalFiles}
            </p>
          </div>
        </AnimatedCard>
        <AnimatedCard
          className="bg-white h-30 dark:bg-gray-800 animate-fade-in-up delay-300"
          style={slideRight}
        >
          <div className="text-center p-4 bg-blue-50 h-23  border-t border-blue-300">
            <h3 className="text-lg font-semibold">📊 Chart Reports</h3>
            <p className="text-3xl font-extrabold mt-2 text-pink-600 dark:text-pink-400">
              {totalCharts}
            </p>
          </div>
        </AnimatedCard>
        
      </div>

      <div
        className="bg-white dark:bg-gray-800 mt-10 rounded-xl shadow p-6 animate-fade-in-up delay-500"
        style={slideLeft}
      >
        <h2 className="text-lg font-semibold mb-4">
          📈 Track user activity:
          <span className="text-sm font-semibold">
            uploads, chart, generations, insights created.{" "}
          </span>
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userFileData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis allowDecimals={false} stroke="#888" />
            <Tooltip
              wrapperStyle={{ backgroundColor: "#333", color: "#fff" }}
              contentStyle={{ backgroundColor: "#444" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="fileCount"
              stroke="#6366f1"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-12 animate-fade-in-up delay-700">
        <AnimatedCard className="bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-600">
            <div className="flex items-center text-lg font-bold">
              <FaUsers className="h-6 w-6 text-blue-500 mr-3" />
              <span className="text-lg font-semibold">
                Quick Actions:
                <span className="text-sm font-medium">
                  {" "}
                  view profile, suspend user, delete user.
                </span>
              </span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {users.map((user, idx) => (
              <div
                key={user._id}
                className="flex justify-between items-center p-4 rounded-lg bg-gray-100 dark:bg-gray-700 animate-fade-in-up"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <FaUserCircle className="text-gray-500 dark:text-gray-300 h-6 w-6" />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <AnimatedButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewUser(user)}
                  >
                    View
                  </AnimatedButton>
                  <AnimatedButton
                    size="sm"
                    variant="secondary"
                    onClick={() => deleteUser(user._id)}
                  >
                    ❌
                  </AnimatedButton>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {showUserModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-40 animate-fade-in-up delay-500"
          style={slideLeft}
        >
          <div className="bg-purple-100 py-2 rounded-lg shadow-lg px-6 max-w-lg w-full relative">
            <AnimatedCard className=" rounded-lg px-4 py-4">
              <div>
                <button
                  className="absolute top-1 right-2 text-gray-500 hover:text-red-500"
                  onClick={() => setShowUserModal(false)}
                >
                  ✖
                </button>

                {selectedUser && (
                  <div className="mb-2">
                    <div className="flex items-center animate-slide-right text-lg font-bold">
                      <Users className="h-10 w-9  text-blue-500 " />
                      <h className="px-2 py-0">
                        I Am {selectedUser.name}
                        <br />
                        <span className="text-sm py-0 text-gray-500">
                          {selectedUser.email}
                        </span>
                      </h>
                    </div>

                    <div className="text-sm/6  absolute top-8 right-0 px-0 text-gray-500">
                      joined on{" "}
                      {new Date(selectedUser.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              {loadingUserData ? (
                <div>Loading...</div>
              ) : (
                <div className="mb-1">
                  <div className="flex border-b mb-1 space-x-25">
                    <div
                      className={`cursor-pointer   py-2 font-semibold transition-colors duration-200 ${
                        activeTab === "files"
                          ? "border-b-1 border-blue-600 text-gray-800"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                      onClick={() => setActiveTab("files")}
                    >
                      <span>
                        <FaRegFileImage className="inline-block ml-1" />
                        Uploaded Files
                      </span>
                    </div>
                    <div
                      className={`cursor-pointer   py-2 font-semibold transition-colors duration-200 ${
                        activeTab === "charts"
                          ? "border-b-1 border-blue-600 text-gray-800 "
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                      onClick={() => setActiveTab("charts")}
                    >
                      <span>
                        <FaRegChartBar className="inline-block ml-1" />
                        Generated Charts
                      </span>
                    </div>
                  </div>

                  {activeTab === "files" && (
                    <div>
                      {userFiles.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No files uploaded.
                        </p>
                      ) : (
                        <div className="list-disc pl-2 overflow-y-auto max-h-96">
                          {userFiles.map((file, index) => (
                            <div
                              key={file._id}
                              className="flex items-center justify-between  m-2 py-2  bg-gray-50 shadow-lg rounded-lg hover-lift transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 animate-slide-up"
                              style={{ animationDelay: `${index * 150}ms` }}
                            >
                              <div className="grid grid-cols-8 gap-2 flex items-center space-x-2">
                                <div className="font-medium col-span-6">
                                  📄{file.originalname}
                                  <br />
                                  <span className="text-sm  text-gray-500">
                                    {" "}
                                    {new Date(file.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <div className=" col-span-2 font-medium   ">
                                  <span className="text-sm mx-7 text-gray-500">
                                    {file.size}kb
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "charts" && (
                    <div>
                      {userCharts.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No charts generated.
                        </p>
                      ) : (
                        <div className="list-disc pl-2 overflow-y-auto max-h-96">
                          {userCharts.map((chart, index) => (
                            <div
                              key={chart._id}
                              className="flex items-center justify-between m-2 py-2  bg-gray-50 shadow-lg rounded-lg hover-lift transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 animate-slide-up"
                              style={{ animationDelay: `${index * 150}ms` }}
                            >
                              <div className="grid grid-cols-8 gap-2 flex items-center space-x-2">
                                <div className="font-medium col-span-6">
                                  📊{chart.filename}
                                  <br />
                                  <span className="text-sm  text-gray-500">
                                    {chart.xAxis} vs {chart.yAxis}
                                    {chart.zAxis ? ` vs ${chart.zAxis}` : ""}.
                                  </span>
                                </div>
                                <div className=" col-span-2 font-medium   ">
                                  <span className="  ">{chart.chartType}</span>
                                  <br />
                                  <span className="text-sm   text-gray-500">
                                    {new Date(chart.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </AnimatedCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
