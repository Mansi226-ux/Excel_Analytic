 

export const process3DScatterData = (rawData, xAxis, yAxis, zAxis) => {
  const result = [];
  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const x = parseFloat(row[xAxis]);
    const y = parseFloat(row[yAxis]);
    const z = parseFloat(row[zAxis]);
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      result.push({ x, y, z });
    }
  }
  return result;
};

export const process3DBarData = (rawData, xAxis, yAxis, zAxis) => {
  // Group by x and y, sum z
  const dataMap = new Map();
  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const x = row[xAxis];
    const y = row[yAxis];
    const z = parseFloat(row[zAxis]);
    if (x !== undefined && y !== undefined && !isNaN(z)) {
      const key = `${x}|${y}`;
      dataMap.set(key, (dataMap.get(key) || 0) + z);
    }
  }
  return Array.from(dataMap.entries()).map(([key, z]) => {
    const [x, y] = key.split("|");
    return { x, y, z };
  });
};

export const process3DPieData = (rawData, xAxis, zAxis) => {
  // Group by x, sum z
  const dataMap = new Map();
  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const category = row[xAxis];
    const value = parseFloat(row[zAxis]);
    if (category !== undefined && !isNaN(value)) {
      dataMap.set(category, (dataMap.get(category) || 0) + value);
    }
  }
  return {
    labels: Array.from(dataMap.keys()),
    values: Array.from(dataMap.values()),
  };
};

export const process3DSurfaceData = (rawData, xAxis, yAxis, zAxis) => {
  // Array of {x, y, z}
  const result = [];
  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const x = parseFloat(row[xAxis]);
    const y = parseFloat(row[yAxis]);
    const z = parseFloat(row[zAxis]);
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      result.push({ x, y, z });
    }
  }
  return result;
};
