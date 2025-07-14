import { useAnimations } from "../../hooks/useAnimations.js";
const TeachStack = () => {
  const { slideLeft, slideRight } = useAnimations();
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h3
          className="text-3xl font-bold text-center text-gray-900 mb-12"
          style={slideRight}
        >
          Built with Modern Technology
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="bg-white rounded-lg shadow-md/100 p-6"
            style={slideLeft}
          >
            <h4 className="text-xl font-semibold text-indigo-600 mb-4">
              Frontend
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li>• React.js with modern hooks</li>
              <li>• Redux Toolkit for state management</li>
              <li>• Chart.js for 2D visualizations</li>
              <li>• Three.js for 3D graphics</li>
              <li>• Tailwind CSS for styling</li>
            </ul>
          </div>
          <div
            className="bg-white rounded-lg shadow-md/100 p-6"
            style={slideRight}
          >
            <h4 className="text-xl font-semibold text-indigo-600 mb-4">
              Backend
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li>• Node.js with Express.js</li>
              <li>• MongoDB for data storage</li>
              <li>• Multer for file uploads</li>
              <li>• SheetJS for Excel parsing</li>
              <li>• JWT-based authentication</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TeachStack;
