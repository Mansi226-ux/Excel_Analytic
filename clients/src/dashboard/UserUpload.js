"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import api from "../services/api.js";
import * as XLSX from "xlsx";
// import Chart3D from "../components/singup/Chart3D.js";
import ChartRenderer from "../components/singup/ChartRenderer.js";
import ChartControls from "../components/singup/ChartControls.js";
import Chart3DControls from "../components/singup/Chart3DControls.js";
import LoadingSkeleton from "../components/singup/LoadingSkeleton.js";
import AnimatedButton from "../components/singup/AnimatedButton.js";
import AnimatedCard from "../components/singup/AnimatedCard.js";
import {
  processDataForChart,
  validateChartData,
} from "../utils/chartDataProcessor.js";
import {
  process3DScatterData,
  process3DBarData,
  process3DPieData,
  process3DSurfaceData,
} from "../utils/3DchartDataProcessor.js";
import {
  useAnimations,
  useStaggeredAnimation,
} from "../hooks/useAnimations.js";
import jsPDF from "jspdf";

function DashboardPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [historyItems, setHistoryItems] = useState([]);
   
  const [columns, setColumns] = useState([]);
  const [selectedXAxis, setSelectedXAxis] = useState("");
  const [selectedYAxis, setSelectedYAxis] = useState("");
  const [selectedZAxis, setSelectedZAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [colorScheme, setColorScheme] = useState("viridis");
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });
  const [chartData, setChartData] = useState(null);
  const [chartRef, setChartRef] = useState(null);
  const [isGeneratingChart, setIsGeneratingChart] = useState(false);
  const { fadeIn } = useAnimations();
  const { getItemStyle } = useStaggeredAnimation(6, 150);
  const canvasRef = useRef();

  // Check if current chart type is 3D
  const is3DChart = chartType?.startsWith("3d-");

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (!selectedFile) {
      showToast(
        "No file selected",
        "Please select a file to upload.",
        "warning"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // fixed here
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setUploadedFile(json);

      if (json && json.length > 0) {
        setColumns(Object.keys(json[0]));
      } else {
        setColumns([]);
      }
    };
    reader.readAsArrayBuffer(selectedFile);

    // upload to backend
    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploadingFile(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Authentication Error", "User not logged in", "error");
      return;
    }
    try {
      const response = await axios.post(api.upload, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      showToast(response.data.message, "success");
      setFile(selectedFile);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      showToast("Uploaded Failed");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const generateChart = async () => {
    if (!uploadedFile || columns.length === 0) {
      showToast(
        "No data",
        "Please upload a file and select columns.",
        "warning"
      );
      return;
    }
    if (
      !selectedXAxis ||
      !selectedYAxis ||
      (is3DChart &&
        !selectedZAxis &&
        ["3d-scatter", "3d-bar", "3d-surface"].includes(chartType))
    ) {
      showToast(
        "Missing selection",
        "Please select all required axes.",
        "warning"
      );
      return;
    }

    setIsGeneratingChart(true);
    try {
      let chartDataResult;

      if (is3DChart) {
        if (chartType === "3d-scatter") {
          chartDataResult = process3DScatterData(
            uploadedFile,
            selectedXAxis,
            selectedYAxis,
            selectedZAxis
          );
          setChartData(chartDataResult);
        } else if (chartType === "3d-bar") {
          chartDataResult = process3DBarData(
            uploadedFile,
            selectedXAxis,
            selectedYAxis,
            selectedZAxis
          );
          setChartData(chartDataResult);
        } else if (chartType === "3d-pie") {
          chartDataResult = process3DPieData(
            uploadedFile,
            selectedXAxis,
            selectedZAxis
          );
          setChartData(chartDataResult);
        } else if (chartType === "3d-surface") {
          chartDataResult = process3DSurfaceData(
            uploadedFile,
            selectedXAxis,
            selectedYAxis,
            selectedZAxis
          );
          setChartData(chartDataResult);
        } else {
          showToast(
            "Not implemented",
            "This 3D chart type is not implemented yet.",
            "info"
          );
          setChartData(null);
        }
      } else {
        chartDataResult = processDataForChart(
          uploadedFile,
          selectedXAxis,
          selectedYAxis,
          chartType
        );
        if (!validateChartData(chartDataResult, chartType)) {
          showToast(
            "Invalid data",
            "Cannot generate chart with the selected data.",
            "error"
          );
          setChartData(null);
          setIsGeneratingChart(false);
          return;
        }
        console.log("3D Chart Data:", chartDataResult);

        setChartData(chartDataResult);
      }
      showToast("Chart generated", "Your chart is ready!", "success");
    } catch (error) {
      showToast("Error", "Failed to generate chart.", "error");
      setChartData(null);
    } finally {
      setIsGeneratingChart(false);
    }
  };

  const handleSaveChart = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        api.chart_save,
        {
          filename: file.name,
          chartType,
          xAxis: selectedXAxis,
          yAxis: selectedYAxis,
          createdAt: new Date(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showToast("Chart Save successfully.", "success");
    } catch (err) {
      showToast("Error", "❌ Save chart failed:", "error");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (activeTab === "history") {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(api.uploaded_history, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data;
          if (Array.isArray(data)) {
            setHistoryItems(data);
          } else {
            console.warn("History Data is not array:", data);
            setHistoryItems([]);
          }
        } catch (error) {
          console.error("History fetch error", error);
          showToast("Error", "Failed to load history", "error");
          setHistoryItems([]);
        }
      }
    };
    fetchHistory();
  }, [activeTab]);

  const handleDelete = async (id) => {
    console.log("Deleting chart Id:", id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(api.chart_delete.replace(":id", id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Chart deleted successfully.", "success");
    } catch (err) {
      showToast("Error", "❌ Delete chart failed:", "error");
    }
  };

  const showToast = (title, message, type = "info") => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast({ show: false, title: "", message: "", type: "" });
    }, 4000);
  };

   const handle3DExport = (format, ref) => {
  const canvas = ref?.current;
   console.log("🧪 canvasRef.current =", canvas);

  if (!canvas) {
    console.error("🧨 3D Canvas ref not available.");
    return;
  }

 const link = document.createElement("a");

  if (format === "png") {
    link.href = canvas.toDataURL("image/png");
    link.download = "chart-3d.png";
  } else if (format === "jpeg") {
    link.href = canvas.toDataURL("image/jpeg");
    link.download = "chart-3d.jpeg";
  } else if (format === "pdf") {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 160);
    pdf.save("chart-3d.pdf");
    return;
  }

  link.click();
};

   

  const tabItems = [
    { id: "upload", label: "Upload & Parse", icon: "📁" },
    { id: "analyze", label: "Data Analysis", icon: "📊" },
    { id: "visualize", label: "Visualization", icon: "📈" },
    { id: "history", label: "History", icon: "📋" },
  ];

  const chartTypeOptions = [
    // 2D Charts
    { value: "bar", label: "Bar Chart", icon: "📊", category: "2D" },
    { value: "line", label: "Line Chart", icon: "📈", category: "2D" },
    { value: "pie", label: "Pie Chart", icon: "🥧", category: "2D" },
    { value: "scatter", label: "Scatter Plot", icon: "🔵", category: "2D" },
    // 3D Charts
    { value: "3d-bar", label: "3D Bar Chart", icon: "🏗️", category: "3D" },
    {
      value: "3d-scatter",
      label: "3D Scatter Plot",
      icon: "🌐",
      category: "3D",
    },
    { value: "3d-pie", label: "3D Pie Chart", icon: "🎯", category: "3D" },
    { value: "3d-surface", label: "3D Surface", icon: "🌊", category: "3D" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br overflow-hidden from-gray-100 to-blue-50">
      <div className="container mx-auto px-4 py-8" style={fadeIn}>
        {/* Animated Toast notification */}
        {toast.show && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-slide-down ${
              toast.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : toast.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="font-medium">{toast.title}</div>
              <div className="animate-pulse">
                {toast.type === "success"
                  ? "✅"
                  : toast.type === "error"
                  ? "❌"
                  : "ℹ️"}
              </div>
            </div>
            <div className="text-sm mt-1">{toast.message}</div>
          </div>
        )}

        {/* Animated Tabs-item */}
        <div className="mb-8 animate-slide-up px-15">
          <div className="border-b border-gray-200 px-6 bg-white rounded-t-lg shadow-sm/50 ">
            <nav className="flex -mb-px">
              {tabItems.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-15 text-center border-b-2 font-medium text-lg transition-all duration-300 hover-lift ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 overflow-hidden"
                  }`}
                  style={getItemStyle(index)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Animated Tab Content */}
        <div className="space-y-6">
          {/* Upload Tab */}
          {activeTab === "upload" && (
            <AnimatedCard className="animate-fade-in">
              <div className="p-6 border-b">
                <div className="flex items-center animate-slide-right">
                  <div className="animate-bounce-in">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-indigo-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Excel File Upload</h2>
                </div>
                <p className="text-gray-600 mt-1 animate-slide-up animate-delay-200">
                  Upload your Excel file (.xls or .xlsx) to begin analysis
                </p>
              </div>
              <div className="p-6 space-y-4">
                {isUploadingFile ? (
                  <LoadingSkeleton type="card" />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover-glow transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50">
                    <div className="animate-float">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400 mx-auto mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-lg font-medium text-gray-700 hover:text-indigo-600  transition-colors">
                        Click to upload or drag and drop
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-500 mt-2">
                      Excel files only (.xlsx, .xls)
                    </p>
                  </div>
                )}

                {uploadedFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-slide-up">
                    <div className="flex items-center">
                      <div className="animate-bounce-in">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600 mr-2"
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
                      <span className="font-medium text-green-800">
                        {file?.name}
                      </span>
                    </div>
                    <p className="text-green-600 text-sm mt-1 animate-slide-up animate-delay-200">
                      File uploaded successfully. {columns.length} columns
                      detected.
                    </p>
                  </div>
                )}
              </div>
            </AnimatedCard>
          )}

          {/* Analyze Tab */}
          {activeTab === "analyze" && (
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedCard delay={0} className="hover-lift">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold animate-slide-right">
                    Data Mapping
                  </h2>
                  <p className="text-gray-600 mt-1 animate-slide-up animate-delay-200">
                    Select axes for your visualization
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Chart Type Selection */}
                  <div className="space-y-2 animate-slide-up">
                    <label className="block text-sm font-medium text-gray-700">
                      Chart Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {chartTypeOptions.map((type, index) => (
                        <button
                          key={type.value}
                          onClick={() => setChartType(type.value)}
                          className={`p-2 rounded-md text-xs transition-all duration-200 hover-lift ${
                            chartType === type.value
                              ? type.category === "3D"
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                : "bg-indigo-600 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span className="mr-1">{type.icon}</span>
                          <div className="text-xs">{type.label}</div>
                          {type.category === "3D" && (
                            <div className="text-xs opacity-75 mt-1">3D</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Axis Selection */}
                  {[
                    "x-axis",
                    "y-axis",
                    ...(is3DChart && chartType === "3d-scatter"
                      ? ["z-axis"]
                      : []),
                  ].map((field, index) => (
                    <div
                      key={field}
                      className="space-y-2 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <label
                        htmlFor={field}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field === "x-axis"
                          ? "X-Axis"
                          : field === "y-axis"
                          ? "Y-Axis"
                          : "Z-Axis"}
                        {field === "z-axis" && (
                          <span className="text-purple-600 ml-1">(3D)</span>
                        )}
                      </label>
                      <select
                        id={field}
                        value={
                          field === "x-axis"
                            ? selectedXAxis
                            : field === "y-axis"
                            ? selectedYAxis
                            : selectedZAxis
                        }
                        onChange={(e) => {
                          if (field === "x-axis")
                            setSelectedXAxis(e.target.value);
                          else if (field === "y-axis")
                            setSelectedYAxis(e.target.value);
                          else setSelectedZAxis(e.target.value);
                        }}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                      >
                        <option value="">
                          Select {field.replace("-", " ")} column
                        </option>
                        {columns.map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </AnimatedCard>

              <AnimatedCard delay={200} className="hover-lift">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold animate-slide-left">
                    Data Preview
                  </h2>
                  <p className="text-gray-600 mt-1 animate-slide-up animate-delay-200">
                    Sample of your uploaded data
                  </p>
                </div>
                <div className="p-6">
                  {uploadedFile ? (
                    <div className="overflow-x-auto animate-fade-in">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {columns.slice(2, 6).map((column, index) => (
                              <th
                                key={column}
                                className="text-left p-2 font-medium animate-slide-down"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {uploadedFile.map((row, Index) => (
                            <tr
                              key={Index}
                              className="border-b hover:bg-gray-50 transition-colors"
                            >
                              {Object.values(row).map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="p-2 animate-slide-up"
                                  style={{
                                    animationDelay: `${
                                      (Index * 4 + cellIndex) * 50
                                    }ms`,
                                  }}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8 animate-pulse">
                      Upload a file to see data preview
                    </p>
                  )}
                </div>
              </AnimatedCard>
            </div>
          )}

          {/* Visualize Tab */}
          {activeTab === "visualize" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Axis Selection */}
                {[
                  "x-axis",
                  "y-axis",
                  ...(is3DChart && chartType === "3d-scatter"
                    ? ["z-axis"]
                    : []),
                ].map((field, index) => (
                  <div
                    key={field}
                    className="space-y-2 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field === "x-axis"
                        ? "X-Axis"
                        : field === "y-axis"
                        ? "Y-Axis"
                        : "Z-Axis"}
                      {field === "z-axis" && (
                        <span className="text-purple-600 ml-1">(3D)</span>
                      )}
                    </label>
                    <select
                      id={field}
                      value={
                        field === "x-axis"
                          ? selectedXAxis
                          : field === "y-axis"
                          ? selectedYAxis
                          : selectedZAxis
                      }
                      onChange={(e) => {
                        if (field === "x-axis")
                          setSelectedXAxis(e.target.value);
                        else if (field === "y-axis")
                          setSelectedYAxis(e.target.value);
                        else setSelectedZAxis(e.target.value);
                      }}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                    >
                      <option value="">
                        Select {field.replace("-", " ")} column
                      </option>
                      {columns.map((column) => (
                        <option key={column} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Chart Display */}
                <div className="lg:col-span-3">
                  <AnimatedCard className="animate-fade-in">
                    <div className="p-6 border-b flex items-center justify-between">
                      <div className="flex items-center animate-slide-right">
                        <div className="animate-bounce-in">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-indigo-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                          </svg>
                        </div>
                        <h2 className="text-xl font-semibold">
                          {is3DChart
                            ? "3D Chart Generation"
                            : "Chart Generation"}
                        </h2>
                      </div>
                      <div className="flex space-x-2 animate-slide-left">
                        <AnimatedButton
                          onClick={generateChart}
                          disabled={
                            isGeneratingChart ||
                            !selectedXAxis ||
                            !selectedYAxis ||
                            (chartType === "3d-scatter" && !selectedZAxis)
                          }
                          loading={isGeneratingChart}
                          variant="primary"
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
                              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                          }
                        >
                          Generate {is3DChart ? "3D " : ""}Chart
                        </AnimatedButton>
                        <AnimatedButton
                          onClick={handleSaveChart}
                          variant="primary"
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 6.75v-1.5A2.25 2.25 0 0015 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V8.25L17.25 6.75z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 3v4.5H9V3h6z"
                              />
                            </svg>
                          }
                        >
                          Save Chart
                        </AnimatedButton>
                      </div>
                    </div>
                    <div className="p-6">
                      {isGeneratingChart ? (
                        <LoadingSkeleton type="chart" />
                      ) : (
                        <ChartRenderer
                          chartType={chartType}
                          data={chartData}
                          xAxis={selectedXAxis}
                          yAxis={selectedYAxis}
                          zAxis={selectedZAxis}
                          title={`${selectedYAxis} vs ${selectedXAxis}${
                            selectedZAxis ? ` vs ${selectedZAxis}` : ""
                          }`}
                          onChartReady={setChartRef}
                          colorScheme={colorScheme}
                        />
                      )}
                    </div>
                    {chartData &&
                      chartRef &&
                      !isGeneratingChart &&
                      !is3DChart && (
                        <div
                          id="chart-wrapper"
                          className="px-6 pb-6 animate-slide-up"
                        >
                          <ChartControls
                            chartRef={chartRef}
                            chartType={chartType}
                            xAxis={selectedXAxis}
                            yAxis={selectedYAxis}
                            onRegenerateChart={generateChart}
                          />
                        </div>
                      )}
                  </AnimatedCard>
                </div>

                <div className="lg:col-span-1">
                  <AnimatedCard delay={200} className="animate-slide-left">
                    <div className="p-4">
                        
                      <Chart3DControls
                        chartType={chartType}
                        onChartTypeChange={setChartType}
                        colorScheme={colorScheme}
                        onColorSchemeChange={setColorScheme}
                        onExport={(format) => handle3DExport(format, chartRef)}
                      />
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <AnimatedCard className="animate-fade-in">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold animate-slide-right">
                  Analysis History
                </h2>
                <p className="text-gray-600 mt-1 animate-slide-up animate-delay-200">
                  Your previous uploads and generated charts
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Array.isArray(historyItems) && historyItems.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">
                      No history found.
                    </p>
                  ) : (
                    Array.isArray(historyItems) &&
                    historyItems.map((item, index) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover-lift transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 animate-slide-up"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="animate-float h-8 w-8"
                            style={{ animationDelay: `${index * 200}ms` }}
                          >
                            📄
                          </div>
                          <div>
                            <h4 className="font-medium">{item.originalname}</h4>
                            <p className="text-sm text-gray-700">
                              Id:{item.userId},
                              <span className="py-4">
                                {" "}
                                {new Date(item.createdAt).toLocaleString()},{""}
                                {item.size}kb
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <AnimatedButton
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDelete(item._id)}
                          >
                            ❌
                          </AnimatedButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
