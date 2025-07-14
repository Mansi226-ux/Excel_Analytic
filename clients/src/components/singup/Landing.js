import { Link } from "react-router-dom";
import { useAnimations } from "../../hooks/useAnimations.js";

const Landing = () => {
  const { slideRight } = useAnimations();

  return (
    <section
      className="container mx-auto px-4 py-12 text-center "
      style={slideRight}
    >
      <div className="max-w-4xl mx-auto  ">
        <h2 className="text-5xl font-bold text-gray-900 mb-6  ease-in ">
          Transform Your Excel Data into
          <span className="text-indigo-600"> Interactive Insights</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Upload Excel files, analyze data, and generate stunning 2D and 3D
          charts. Choose your axes dynamically and download professional
          visualizations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-8 py-3 text-lg rounded-md bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Start Analyzing
          </Link>
          <Link
            to="/admin"
            className="px-8 py-3 text-lg rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 inline-flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Admin Tools
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Landing;
