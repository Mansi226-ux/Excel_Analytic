export const processDataForChart = (rawData, xAxis, yAxis, chartType) => {
  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    return null;
  }
  try {
    switch (chartType) {
      case "scatter":
        return processScatterData(rawData, xAxis, yAxis);
      case "pie":
        return processPieData(rawData, xAxis, yAxis);
      default:
        return processStandardData(rawData, xAxis, yAxis);
    }
  } catch (error) {
    console.error("Error processing chart data:", error);
    return null;
  }
};

const processStandardData = (rawData, xAxis, yAxis) => {
  const labels = [];
  const values = [];
  rawData.forEach((row) => {
    if (row[xAxis] !== undefined && row[yAxis] !== undefined) {
      labels.push(String(row[xAxis]));
      const value = Number.parseFloat(row[yAxis]);
      values.push(isNaN(value) ? 0 : value);
    }
  });
  return { labels, values };
};

const processScatterData = (rawData, xAxis, yAxis) => {
  const scatterData = [];
  rawData.forEach((row) => {
    if (row[xAxis] !== undefined && row[yAxis] !== undefined) {
      const x = Number.parseFloat(row[xAxis]);
      const y = Number.parseFloat(row[yAxis]);
      if (!isNaN(x) && !isNaN(y)) {
        scatterData.push({ x, y });
      }
    }
  });
  return { scatterData, labels: [], values: [] };
};

const processPieData = (rawData, xAxis, yAxis) => {
  const dataMap = new Map();
  rawData.forEach((row) => {
    if (row[xAxis] !== undefined && row[yAxis] !== undefined) {
      const category = String(row[xAxis]);
      const value = Number.parseFloat(row[yAxis]);
      if (!isNaN(value)) {
        if (dataMap.has(category)) {
          dataMap.set(category, dataMap.get(category) + value);
        } else {
          dataMap.set(category, value);
        }
      }
    }
  });
  const labels = Array.from(dataMap.keys());
  const values = Array.from(dataMap.values());
  return { labels, values };
};

export const validateChartData = (data, chartType) => {
  if (!data) return false;
  switch (chartType) {
    case "scatter":
      return (
        data.scatterData &&
        Array.isArray(data.scatterData) &&
        data.scatterData.length > 0
      );
    default:
      return (
        data.labels &&
        Array.isArray(data.labels) &&
        data.labels.length > 0 &&
        data.values &&
        Array.isArray(data.values) &&
        data.values.length > 0
      );
  }
};
