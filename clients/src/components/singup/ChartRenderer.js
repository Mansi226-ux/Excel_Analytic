import { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import Chart3D from "./Chart3D.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartRenderer = ({
  chartType,
  data,
  xAxis,
  yAxis,
  zAxis,
  title,
  onChartReady,
  colorScheme = "viridis",
}) => {
  const chartRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const canvasDomRef = useRef(null);


  // Check if this is a 3D chart type
  const is3DChart = chartType?.startsWith("3d-");

  // Advanced animation configurations for 2D charts
  const getAnimationConfig = (type) => {
    const baseConfig = {
      duration: 1500,
      easing: "easeInOutQuart",
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default") {
          delay = context.dataIndex * 100 + context.datasetIndex * 50;
        }
        return delay;
      },
    };

    switch (type) {
      case "bar":
        return {
          ...baseConfig,
          y: {
            from: (ctx) => ctx.chart.scales.y.getPixelForValue(0),
            duration: 1200,
            easing: "easeOutBounce",
          },
          x: {
            duration: 800,
            easing: "easeOutQuart",
          },
        };

      case "line":
        return {
          ...baseConfig,
          x: {
            type: "number",
            easing: "linear",
            duration: 2000,
            from: Number.NaN,
          },
          y: {
            type: "number",
            easing: "easeInOutCubic",
            duration: 1500,
            from: (ctx) =>
              ctx.chart.scales.y.getPixelForValue(ctx.chart.scales.y.min),
          },
          tension: {
            duration: 1000,
            easing: "easeInOutSine",
            from: 1,
            to: 0.4,
          },
        };

      case "pie":
        return {
          ...baseConfig,
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: "easeInOutElastic",
        };

      case "scatter":
        return {
          ...baseConfig,
          x: {
            type: "number",
            easing: "easeOutBack",
            duration: 1500,
            from: (ctx) =>
              ctx.chart.scales.x.getPixelForValue(ctx.chart.scales.x.min),
          },
          y: {
            type: "number",
            easing: "easeOutBack",
            duration: 1500,
            from: (ctx) =>
              ctx.chart.scales.y.getPixelForValue(ctx.chart.scales.y.max),
          },
        };

      default:
        return baseConfig;
    }
  };

  // Advanced interaction animations for 2D charts
  const getHoverAnimations = () => ({
    hover: {
      animationDuration: 300,
      mode: "nearest",
      intersect: false,
    },
    onHover: (event, activeElements, chart) => {
      event.native.target.style.cursor =
        activeElements.length > 0 ? "pointer" : "default";

      if (activeElements.length > 0) {
        chart.canvas.style.transform = "scale(1.02)";
        chart.canvas.style.transition = "transform 0.2s ease-in-out";
      } else {
        chart.canvas.style.transform = "scale(1)";
      }
    },
  });

  // Chart configuration options with advanced animations for 2D charts
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: getAnimationConfig(chartType),
    ...getHoverAnimations(),
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "500",
          },
        },
        onHover: (event, legendItem, legend) => {
          legend.chart.canvas.style.cursor = "pointer";
        },
        onLeave: (event, legendItem, legend) => {
          legend.chart.canvas.style.cursor = "default";
        },
      },
      title: {
        display: true,
        text: title || `${yAxis} vs ${xAxis}`,
        font: {
          size: 18,
          weight: "bold",
        },
        padding: 25,
        color: "#1f2937",
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        animation: {
          duration: 200,
          easing: "easeOutQuart",
        },
        callbacks: {
          beforeTitle: () => "📊",
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y || context.parsed;
            return `${label}: ${
              typeof value === "number" ? value.toLocaleString() : value
            }`;
          },
        },
      },
    },
    scales:
      chartType !== "pie" && !is3DChart
        ? {
            x: {
              title: {
                display: true,
                text: xAxis,
                font: {
                  size: 14,
                  weight: "bold",
                },
                color: "#374151",
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
                lineWidth: 1,
              },
              ticks: {
                color: "#6b7280",
                font: {
                  size: 11,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: yAxis,
                font: {
                  size: 14,
                  weight: "bold",
                },
                color: "#374151",
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
                lineWidth: 1,
              },
              ticks: {
                color: "#6b7280",
                font: {
                  size: 11,
                },
              },
              beginAtZero: true,
            },
          }
        : {},
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      point: {
        radius: chartType === "line" ? 6 : 4,
        hoverRadius: chartType === "line" ? 10 : 8,
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
      line: {
        borderWidth: 3,
        tension: 0.4,
      },
      bar: {
        borderRadius: 4,
        borderSkipped: false,
      },
    },
  };

   
  const generateGradientColors = (ctx, count) => {
    const gradients = [];
    const colors = [
      { start: "rgba(99, 102, 241, 0.8)", end: "rgba(99, 102, 241, 0.2)" },
      { start: "rgba(34, 197, 94, 0.8)", end: "rgba(34, 197, 94, 0.2)" },
      { start: "rgba(239, 68, 68, 0.8)", end: "rgba(239, 68, 68, 0.2)" },
      { start: "rgba(245, 158, 11, 0.8)", end: "rgba(245, 158, 11, 0.2)" },
      { start: "rgba(168, 85, 247, 0.8)", end: "rgba(168, 85, 247, 0.2)" },
    ];

    for (let i = 0; i < count; i++) {
      const colorSet = colors[i % colors.length];
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, colorSet.start);
      gradient.addColorStop(1, colorSet.end);
      gradients.push(gradient);
    }

    return gradients;
  };

   
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: `${yAxis} by ${xAxis}`,
        data: data?.values || data?.scatterData || [],
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx } = chart;
          if (chartType === "pie") {
            return [
              "rgba(99, 102, 241, 0.8)",
              "rgba(34, 197, 94, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(168, 85, 247, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(20, 184, 166, 0.8)",
            ];
          }
          return generateGradientColors(ctx, 1)[0];
        },
        borderColor:
          chartType === "pie"
            ? [
                "rgba(99, 102, 241, 1)",
                "rgba(34, 197, 94, 1)",
                "rgba(239, 68, 68, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(168, 85, 247, 1)",
              ]
            : "rgba(99, 102, 241, 1)",
        borderWidth: chartType === "pie" ? 3 : 2,
        fill: chartType === "line" ? true : undefined,
        tension: chartType === "line" ? 0.4 : undefined,
        pointBackgroundColor:
          chartType === "line" ? "rgba(99, 102, 241, 1)" : undefined,
        pointBorderColor: chartType === "line" ? "#fff" : undefined,
        pointBorderWidth: chartType === "line" ? 3 : undefined,
        pointRadius: chartType === "line" ? 6 : undefined,
        pointHoverRadius: chartType === "line" ? 10 : undefined,
        pointHoverBackgroundColor:
          chartType === "line" ? "rgba(99, 102, 241, 1)" : undefined,
        pointHoverBorderColor: chartType === "line" ? "#fff" : undefined,
        pointHoverBorderWidth: chartType === "line" ? 4 : undefined,
      },
    ],
  };

 
  useEffect(() => {
    setIsAnimating(true);
    setChartKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [chartType, data]);
 
  useEffect(() => {
    if (chartRef.current && onChartReady) {
      onChartReady(chartRef);
    }
  }, [onChartReady]);

   
  if (is3DChart) {
    return (
      <div
        className={`h-96 w-full transition-all duration-500 ease-in-out ${
          isAnimating ? "animate-chart-enter" : ""
        }`}
      >
        {isAnimating && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 animate-fade-in">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Generating 3D chart...
              </p>
            </div>
          </div>
        )}
        <div
          className={`h-full transition-opacity duration-300 ${
            isAnimating ? "opacity-50" : "opacity-100"
          }`}
        >
          <Chart3D
          ref={chartRef}
            chartType={chartType}
            data={data}
            xAxis={xAxis}
            yAxis={yAxis}
            zAxis={zAxis}
            title={title}
            colorScheme={colorScheme}
          />
        </div>
      </div>
    );
  }

  const render2DChart = () => {
  const commonProps = {
    data: chartData,
    options,
    key: chartKey,
     ref: (instance) => {
      if (instance) {
        chartRef.current = instance;
      }
    },
    fallbackContent: null,
  };

  switch (chartType) {
    case "bar":
      return <Bar {...commonProps} />;
    case "line":
      return <Line {...commonProps} />;
    case "pie":
      return <Pie {...commonProps} />;
    case "scatter":
      return <Scatter {...commonProps} />;
    default:
      return <Bar {...commonProps} />;
  }
};

  return (
    <div
      data-chart-type={chartType}
      className={`chart-canvas-wrapper h-96 w-full transition-all duration-500 ease-in-out ${
        isAnimating ? "animate-chart-enter" : ""
      }`}
    >
      <div className="relative h-full w-full">
        {isAnimating && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 animate-fade-in">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Generating chart...</p>
            </div>
          </div>
        )}
        <div
          className={`h-full transition-opacity duration-300 ${
            isAnimating ? "opacity-50" : "opacity-100"
          }`}
        >
          {render2DChart()}
        </div>
      </div>
    </div>
  );
};

export default ChartRenderer;
