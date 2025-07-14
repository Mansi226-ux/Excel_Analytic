"use client";
import React from "react";
import { forwardRef,useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Box,
  Sphere,
  Cylinder,
  ContactShadows,
  Html,
  Plane,
  Line,
} from "@react-three/drei";
import * as THREE from "three";

// 3D Bar Chart Component
const Bar3D = ({
  position,
  height,
  color,
  label,
  value,
  isHovered,
  onClick,
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(1, height, 1);
      meshRef.current.position.y = height / 2;
    }
  }, [height, hovered, isHovered]);

  return (
    <group position={position}>
      {/* Main Bar */}
      <Box
        ref={meshRef}
        args={[0.8, 1, 0.8]}
        position={[0, height / 2, 0]}
        scale={[1, height, 1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </Box>

      {/* Value Label */}
      {hovered && (
        <Html center>
          <div
            className="bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none"
            style={{ transform: "scale(0.9)" }}
          >
            {label}: {value}
          </div>
        </Html>
      )}

      {/* Base Platform */}
      <Cylinder args={[0.5, 0.5, 0.1]} position={[0, 0.05, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f0f0" metalness={0.8} roughness={0.2} />
      </Cylinder>
    </group>
  );
};

// 3D Scatter Plot Component
const ScatterPoint3D = ({
  position,
  color,
  size,
  label,
  value,
  isHovered,
  index,
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered || isHovered ? 1.2 : 1);
    }
  }, [hovered, isHovered]);

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 8, 8]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Sphere>

      {/* Connecting Line to Base */}
      <Line
        points={[
          [0, 0, 0],
          [0, -position[1], 0],
        ]}
        color={color}
        lineWidth={2}
        opacity={0.3}
        transparent
      />

      {/* Value Label */}
      {hovered && (
        <Html center>
          <div
            className="bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none"
            style={{ transform: "scale(0.9)" }}
          >
            {label}: {value}
          </div>
        </Html>
      )}
    </group>
  );
};

// 3D Surface Chart Component
const Surface3D = ({ data, colorScale }) => {
  const meshRef = useRef();
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const width = data[0].length;
      const height = data.length;
      const geometry = new THREE.PlaneGeometry(
        width - 1,
        height - 1,
        width - 1,
        height - 1
      );

      // Modify vertices
      const vertices = geometry.attributes.position.array;
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          const index = (i * width + j) * 3;
          vertices[index + 2] = data[i][j] * 2;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      setGeometry(geometry);
    }
  }, [data]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  if (!geometry) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={colorScale}
        metalness={0.4}
        roughness={0.6}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// 3D Line Chart Component
const Line3D = ({ points, color }) => {
  const lineRef = useRef();

  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(...p))
  );

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial attach="material" color={color} linewidth={2} />
    </line>
  );
};

// 3D Bubble Chart Component
const Bubble3D = ({
  position,
  radius,
  color,
  label,
  value,
  isHovered,
  index,
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered || isHovered ? 1.2 : 1);
    }
  }, [hovered, isHovered]);

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[radius, 8, 8]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Sphere>

      {/* Value Label */}
      {hovered && (
        <Html center>
          <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none">
            {label}: {value}
          </div>
        </Html>
      )}
    </group>
  );
};

// 3D Pie Chart Component
const PieSlice3D = ({
  startAngle,
  endAngle,
  radius,
  height,
  color,
  label,
  value,
  index,
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.y = hovered ? 0.2 : 0;
    }
  }, [hovered]);

  // Create pie slice geometry
  const angle = endAngle - startAngle;
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    32,
    1,
    false,
    startAngle,
    angle
  );

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>

      {/* Label */}
      {hovered && (
        <Html center>
          <div
            className="bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none"
            style={{ transform: "scale(0.9)" }}
          >
            {label}: {value}
          </div>
        </Html>
      )}
    </group>
  );
};

// Grid and Axes Component
const GridAndAxes = ({
  size = 10,
  divisions = 10,
  xLabel = "X",
  yLabel = "Y",
  zLabel = "Z",
}) => {
  return (
    <group>
      {/* Grid */}
      <gridHelper args={[size, divisions]} position={[0, 0, 0]} />

      {/* Axes */}
      <Line
        points={[
          [0, 0, 0],
          [size / 2, 0, 0],
        ]}
        color="red"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, size / 2, 0],
        ]}
        color="green"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, 0, size / 2],
        ]}
        color="blue"
        lineWidth={3}
      />

      {/* Axis Labels */}
      <Text
        position={[size / 2 + 0.5, 0, 0]}
        fontSize={0.5}
        color="red"
        anchorX="center"
        anchorY="middle"
      >
        {xLabel}
      </Text>
      <Text
        position={[0, size / 2 + 0.5, 0]}
        fontSize={0.5}
        color="green"
        anchorX="center"
        anchorY="middle"
      >
        {yLabel}
      </Text>
      <Text
        position={[0, 0, size / 2 + 0.5]}
        fontSize={0.5}
        color="blue"
        anchorX="center"
        anchorY="middle"
      >
        {zLabel}
      </Text>
    </group>
  );
};

// Loading Component for 3D Scene
const Loading3D = () => (
  <Html center>
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <div className="text-gray-600 font-medium">Loading 3D Scene...</div>
    </div>
  </Html>
);

// Main 3D Chart Component
const Chart3D = forwardRef(({...props }, ref) => {
  const canvasRef = useRef();
  const {
    chartType,
    data,
    xAxis,
    yAxis,
    zAxis,
    title,
    colorScheme = "viridis",
  } = props;

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [cameraPosition, setCameraPosition] = useState([10, 10, 10]);
  const webglRef = useRef();
  // Color schemes
  const colorSchemes = {
    viridis: ["#440154", "#31688e", "#35b779", "#fde725"],
    plasma: ["#0d0887", "#7e03a8", "#cc4778", "#f89441", "#f0f921"],
    cool: ["#6e40aa", "#5d68b3", "#4c90c0", "#3db5c7", "#41d6c3"],
    warm: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b"],
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.viridis;

  const getColor = (index, total) => {
    const colorIndex = Math.floor((index / total) * (colors.length - 1));
    return colors[colorIndex];
  };

  useEffect(() => {
    if (chartType === "3d-scatter" && data.labels && data.values) {
      data.scatterData = data.labels.map((label, index) => ({
        x: index * 10,
        y: data.values[index],
        z: Math.random() * 10,
      }));
    }

    if (chartType === "3d-bubble" && data.labels && data.values) {
      data.bubbleData = data.labels.map((label, index) => ({
        x: index * 10,
        y: data.values[index],
        z: Math.random() * 10,
        radius: data.values[index] / Math.max(...data.values) + 0.3,
      }));
    }
  }, [chartType, data]);

  const renderChart = () => {
    if (!data || !data.labels || data.labels.length === 0) {
      return (
        <Html center>
          <div className="text-center">
            <div className="text-gray-500 text-lg">No 3D data available</div>
            <div className="text-gray-400 text-sm mt-2">
              Upload data to generate 3D visualization
            </div>
          </div>
        </Html>
      );
    }

    switch (chartType) {
      case "3d-bar":
        return data.labels.map((label, index) => (
          <Bar3D
            key={index}
            position={[index * 2 - (data.labels.length - 1), 0, 0]}
            height={(data.values[index] / Math.max(...data.values)) * 5}
            color={getColor(index, data.labels.length)}
            label={label}
            value={data.values[index]}
            isHovered={selectedPoint === index}
            onClick={() =>
              setSelectedPoint(selectedPoint === index ? null : index)
            }
          />
        ));

      case "3d-scatter":
        if (!data.scatterData) return;
        return (
          data.scatterData?.map((point, index) => (
            <ScatterPoint3D
              key={index}
              position={[
                point.x / 10 - 5,
                point.y / 100,
                point.z ? point.z / 10 - 5 : 0,
              ]}
              color={getColor(index, data.scatterData.length)}
              size={0.2}
              label={`Point ${index + 1}`}
              value={`(${point.x}, ${point.y}${point.z ? `, ${point.z}` : ""})`}
              isHovered={selectedPoint === index}
              index={index}
            />
          )) || []
        );

      case "3d-pie":
        let currentAngle = 0;
        const total = data.values.reduce((sum, value) => sum + value, 0);
        return data.labels.map((label, index) => {
          const angle = (data.values[index] / total) * Math.PI * 2;
          const slice = (
            <PieSlice3D
              key={index}
              startAngle={currentAngle}
              endAngle={currentAngle + angle}
              radius={3}
              height={1}
              color={getColor(index, data.labels.length)}
              label={label}
              value={data.values[index]}
              index={index}
            />
          );
          currentAngle += angle;
          return slice;
        });

      case "3d-surface":
        const surfaceData =
          data.surfaceData ||
          Array.from({ length: 20 }, (_, i) =>
            Array.from(
              { length: 20 },
              (_, j) => Math.sin(i * 0.3) * Math.cos(j * 0.3) * 2
            )
          );
        return <Surface3D data={surfaceData} colorScale={colors[0]} />;

      case "3d-line":
        return (
          <Line3D
            points={data.values.map((value, index) => [
              index * 2 - (data.labels.length - 1),
              (value / Math.max(...data.values)) * 5,
              0,
            ])}
            color={getColor(0, 1)}
          />
        );

      case "3d-bubble":
        if (!data.bubbleData) return;
        return data.bubbleData?.map((point, index) => (
          <Bubble3D
            key={index}
            position={[point.x / 10 - 5, point.y / 10, point.z || 0]}
            radius={point.radius || 0.3}
            color={getColor(index, data.bubbleData.length)}
            label={`Bubble ${index + 1}`}
            value={`(${point.x}, ${point.y}, ${point.z || 0})`}
            isHovered={selectedPoint === index}
            index={index}
          />
        ));
      default:
        return null;
    }
  };

  return (
    <div className="h-96 w-full bg-gradient-to-b from-gray-900 to-gray-700 rounded-lg overflow-hidden">
      <Canvas ref={canvasRef}
        camera={{ position: cameraPosition, fov: 45 }}
        shadows={false}
        dpr={[1, 2]}
         
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#1a1a1a");
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          if (ref && typeof ref === "object") {
            ref.current = gl.domElement;  
          }
        }}
      >
        <Suspense fallback={<Loading3D />}>
          {/* Lighting Setup */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#4f46e5"
          />
          <spotLight
            position={[0, 15, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
            color="#fbbf24"
          />

          <color attach="background" args={["#1a1a1a"]} />

          {/* Ground */}
          <Plane
            args={[20, 20]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.1, 0]}
            receiveShadow
          >
            <meshStandardMaterial
              color="#2d3748"
              metalness={0.1}
              roughness={0.8}
            />
          </Plane>

          {/* Contact Shadows */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
            far={4}
            resolution={256}
            color="#000000"
          />

          <GridAndAxes xLabel={xAxis} yLabel="Value" zLabel={zAxis || "Z"} />

          {renderChart()}

          {/* Title */}
          {title && (
            <Text
              position={[0, 8, 0]}
              fontSize={0.8}
              color="white"
              anchorX="center"
              anchorY="middle"
              font="/fonts/static/Inter_28pt-Bold.ttf"
            >
              {title}
            </Text>
          )}

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* 3D Controls UI */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-lg p-2 space-y-2">
        <button
          onClick={() => setCameraPosition([10, 10, 10])}
          className="block w-full text-white text-xs px-2 py-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          Reset View
        </button>
        <button
          onClick={() => setCameraPosition([0, 15, 0])}
          className="block w-full text-white text-xs px-2 py-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          Top View
        </button>
        <button
          onClick={() => setCameraPosition([15, 5, 0])}
          className="block w-full text-white text-xs px-2 py-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          Side View
        </button>
      </div>

      {/* Legend */}
      {data && data.labels && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-lg p-3 max-w-xs">
          <div className="text-white text-sm font-medium mb-2">Legend</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.labels.slice(0, 6).map((label, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor: getColor(index, data.labels.length),
                  }}
                ></div>
                <span className="text-white text-xs">{label}</span>
              </div>
            ))}
            {data.labels.length > 6 && (
              <div className="text-gray-400 text-xs">
                +{data.labels.length - 6} more...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
Chart3D.displayName = "Chart3D";
export default Chart3D;
