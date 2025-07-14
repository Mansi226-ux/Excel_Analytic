"use client";
import jsPDF from "jspdf";

const ChartControls = ({
  chartRef,
  chartType,
  xAxis,
  yAxis,
  onRegenerateChart,
}) => {
 const downloadAsImage = (format = "png") => {
  const chartInstance = chartRef?.current;

  // Try both paths to get canvas
  const canvas =
    chartInstance?.canvas ||
    chartInstance?.ctx?.canvas ||
    document.querySelector("canvas");

  if (!canvas) {
    console.error("❌ Canvas element not found in chartRef:", chartRef);
    alert("Chart canvas not found. Please try again.");
    return;
  }

  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
  const fileExtension = format === "jpeg" ? "jpg" : "png";
  const imageData = canvas.toDataURL(mimeType);

  const link = document.createElement("a");
  link.download = `chart-${Date.now()}.${fileExtension}`;
  link.href = imageData;
  link.click();
};






const downloadAsPDF = () => {
  const canvas = document.querySelector("canvas"); // or chartRef.current if you use it
  if (!canvas) {
    alert("Canvas not found!");
    return;
  }

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`chart-${Date.now()}.pdf`);
};



  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
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
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="6" x2="12" y2="12"></line>
          <line x1="16" y1="10" x2="12" y2="12"></line>
        </svg>
        <span>
          Chart Type:{" "}
          <strong>
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
          </strong>
        </span>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
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
          <path d="M3 3v18h18"></path>
          <path d="M7 12l4-4 4 4 6-6"></path>
        </svg>
        <span>
          Axes:{" "}
          <strong>
            {xAxis} vs {yAxis}
          </strong>
        </span>
      </div>

      <div className="flex-1"></div>

      <div className="flex space-x-2">
        <button
          onClick={onRegenerateChart}
          className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
          </svg>
          Refresh
        </button>

        <button
          onClick={() => downloadAsImage("png")}
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          PNG
        </button>

        <button
          onClick={() => downloadAsImage("jpeg")}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          JPEG
        </button>

        <button
          onClick={downloadAsPDF}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          PDF
        </button>
      </div>
    </div>
  );
};

export default ChartControls;
