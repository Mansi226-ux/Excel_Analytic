"use client";

const LoadingSkeleton = ({ type = "chart" }) => {
  if (type === "chart") {
    return (
      <div className="h-96 w-full bg-gray-100 rounded-lg animate-pulse">
        <div className="p-6 space-y-4">
          {/* Chart title skeleton */}
          <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto animate-pulse"></div>

          {/* Chart area skeleton */}
          <div className="h-64 bg-gray-200 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>

            {/* Simulated chart bars */}
            <div className="flex items-end justify-around h-full p-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-300 rounded-t animate-pulse"
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    width: "12%",
                    animationDelay: `${i * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Legend skeleton */}
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-3 animate-pulse">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-300 rounded animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        {/* Table rows */}
        {[...Array(3)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{
                  animationDelay: `${(rowIndex * 4 + colIndex) * 0.05}s`,
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
