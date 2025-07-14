import AnimatedButton from "./AnimatedButton.js";
import AnimatedCard from "./AnimatedCard.js";
import { useAnimations } from "../../hooks/useAnimations.js";

const KeyFeature = () => {
  const { slideLeft, slideRight } = useAnimations();
  return (
    <section className="container mx-auto px-4 py-16">
      <h3
        className="text-3xl font-bold text-center text-gray-900 mb-12 animate-slide-left animate-delay-400"
        style={slideLeft}
      >
        Key Features
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          className="bg-white rounded-lg shadow-lg hover:shadow-lg transition-shadow p-6"
          style={slideRight}
        >
          <div className="mb-4">
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <h4 className="text-xl font-semibold mb-2">Excel File Upload</h4>
          <p className="text-gray-600">
            Support for .xls and .xlsx files with automatic parsing and data
            extraction
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg hover:shadow-lg transition-shadow p-6"
          style={slideLeft}
        >
          <div className="mb-4">
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <h4 className="text-xl font-semibold mb-2">Dynamic Data Mapping</h4>
          <p className="text-gray-600">
            Choose X and Y axes from column headers and generate charts
            dynamically
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg hover:shadow-lg transition-shadow p-6"
          style={slideRight}
        >
          <div className="mb-4">
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
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h4 className="text-xl font-semibold mb-2">2D & 3D Charts</h4>
          <p className="text-gray-600">
            Generate bar, line, pie, scatter, and 3D column charts with
            professional styling
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg hover:shadow-lg transition-shadow p-6"
          style={slideLeft}
        >
          <div className="mb-4">
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <h4 className="text-xl font-semibold mb-2">Downloadable Graphics</h4>
          <p className="text-gray-600">
            Export your visualizations as PNG or PDF files for presentations
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg hover:shadow-lg transition-shadow p-6"
          style={slideRight}
        >
          <div className="mb-4">
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h4 className="text-xl font-semibold mb-2">User Dashboard</h4>
          <p className="text-gray-600">
            Track upload history, manage analyses, and view all your generated
            charts
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg hover:shadow-lg transition-shadow p-6"
          style={slideLeft}
        >
          <div className="mb-4">
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
          <h4 className="text-xl font-semibold mb-2">AI Insights</h4>
          <p className="text-gray-600">
            Optional AI integration for smart insights and automated summary
            reports
          </p>
        </div>
      </div>
    </section>
  );
};
export default KeyFeature;
