"use client";
import AnimatedButton from "./AnimatedButton.js";
import { useRef } from "react";

 
const Chart3DControls = ({
  chartType,
  onChartTypeChange,
  colorScheme,
  onColorSchemeChange,
  onExport,
  canvasRef
}) => {
  const chartTypes = [
    {
      value: "bar",
      label: "Bar Chart",
      icon: "📊",
      description: "Vertical bars in space",
    },
    {
      value: "scatter",
      label: "Scatter Plot",
      icon: "🔵",
      description: "Points in coordinates",
    },
    {
      value: "pie",
      label: "Pie Chart",
      icon: "🥧",
      description: "Circular segments with depth",
    },
    {
      value: "line",
      label: "Line Chart",
      icon: "📈",
      description: "Connected lines ",
    },

    {
      value: "3d-bar",
      label: "3D Bar Chart",
      icon: "📊",
      description: "Vertical bars in 3D space",
    },
    {
      value: "3d-scatter",
      label: "3D Scatter Plot",
      icon: "🔵",
      description: "Points in 3D coordinates",
    },
    {
      value: "3d-pie",
      label: "3D Pie Chart",
      icon: "🥧",
      description: "Circular segments with depth",
    },
    {
      value: "3d-surface",
      label: "3D Surface",
      icon: "🌊",
      description: "Continuous surface mesh",
    },
    {
      value: "3d-line",
      label: "3D Line Chart",
      icon: "📈",
      description: "Connected lines in 3D",
    },
    {
      value: "3d-bubble",
      label: "3D Bubble Chart",
      icon: "🫧",
      description: "Sized spheres in 3D space",
    },
  ];

  const colorSchemes = [
    {
      value: "viridis",
      label: "Viridis",
      colors: ["#440154", "#31688e", "#35b779", "#fde725"],
      description: "Perceptually uniform, colorblind-friendly",
    },
    {
      value: "plasma",
      label: "Plasma",
      colors: ["#0d0887", "#7e03a8", "#cc4778", "#f89441"],
      description: "High contrast, vibrant colors",
    },
    {
      value: "cool",
      label: "Cool",
      colors: ["#6e40aa", "#5d68b3", "#4c90c0", "#3db5c7"],
      description: "Cool blues and purples",
    },
    {
      value: "warm",
      label: "Warm",
      colors: ["#d73027", "#f46d43", "#fdae61", "#fee08b"],
      description: "Warm reds and yellows",
    },
    {
      value: "rainbow",
      label: "Rainbow",
      colors: [
        "#ff0000",
        "#ff8000",
        "#ffff00",
        "#00ff00",
        "#0080ff",
        "#8000ff",
      ],
      description: "Full spectrum rainbow",
    },
    {
      value: "monochrome",
      label: "Monochrome",
      colors: ["#000000", "#404040", "#808080", "#c0c0c0"],
      description: "Grayscale gradient",
    },
  ];

  const exportFormats = [
    {
      value: "png",
      label: "PNG Image",
      icon: "🖼️",
      description: "High-quality raster image",
    },
    {
      value: "jpg",
      label: "JPEG Image",
      icon: "📷",
      description: "Compressed raster image",
    },
    
    {
      value: "pdf",
      label: "PDF Document",
      icon: "📄",
      description: "Portable document format",
    },
  ];
  

  return (
    <div className="bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-lg p-4 space-y-4 text-white max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="mr-2">🎛️</span>
          3D Controls
        </h3>
        <div className="flex space-x-1">
          <button className="px-2 py-1 rounded text-xs transition-colors bg-indigo-600 text-white">
            Basic
          </button>
        </div>
      </div>

      {/* Chart Type Selection */}
      <div className="space-y-3">
        <label className=" text-sm font-medium text-gray-300 flex items-center">
          <span className="mr-2">📊</span>
          Chart Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {chartTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onChartTypeChange(type.value)}
              className={`p-3 rounded-md text-left transition-all duration-200 ${
                chartType === type.value
                  ? "bg-indigo-600 text-white shadow-lg border-2 border-indigo-400"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{type.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs opacity-75">{type.description}</div>
                  </div>
                </div>
                {chartType === type.value && (
                  <span className="text-green-400">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300 flex items-center">
          <span className="mr-2">🎨</span>
          Color Scheme
        </label>
        <div className="space-y-2">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.value}
              onClick={() => onColorSchemeChange(scheme.value)}
              className={`w-full p-3 rounded-md transition-all duration-200 ${
                colorScheme === scheme.value
                  ? "bg-indigo-600 text-white border-2 border-indigo-400"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-medium text-sm">{scheme.label}</div>
                  <div className="text-xs opacity-75">{scheme.description}</div>
                </div>
                <div className="flex space-x-1">
                  {scheme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-400 shadow-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300 flex items-center">
          <span className="mr-2">💾</span>
          Export Options
        </label>
        <div className="grid grid-cols-2 gap-2">
          {exportFormats.map((format) => (
            <AnimatedButton
              key={format.value}
              onClick={() => onExport(format.value)}
              variant="outline"
              size="sm"
              className="text-xs"
              title={format.description}
            >
              <span className="mr-1">{format.icon}</span>
              {format.label}
            </AnimatedButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chart3DControls;
