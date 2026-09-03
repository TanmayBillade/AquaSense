/**
 * Performs simple linear regression on a dataset.
 * @param {Array} data - Array of objects with x and y properties.
 * @returns {Object} { slope, intercept, r2 }
 */
export const linearRegression = (data) => {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0, r2: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
  
  data.forEach(point => {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
    sumYY += point.y * point.y;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 0;
  const intercept = (sumY - slope * sumX) / n || 0;
  
  // Calculate R-squared
  const meanY = sumY / n;
  let ssTot = 0, ssRes = 0;
  data.forEach(point => {
    ssTot += Math.pow(point.y - meanY, 2);
    ssRes += Math.pow(point.y - (slope * point.x + intercept), 2);
  });
  const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);

  return { slope, intercept, r2 };
};

/**
 * Predicts the TDS value `hoursAhead` into the future.
 * Uses up to the last 48 readings.
 * @param {Array} readings - Array of recent reading objects.
 * @param {number} hoursAhead - Number of hours ahead to predict.
 * @returns {number} Predicted TDS value
 */
export const predictTDS = (readings, hoursAhead) => {
  if (!readings || readings.length === 0) return 0;
  
  const recent = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).slice(-48);
  const baseTime = new Date(recent[0].timestamp).getTime();
  
  const dataPoints = recent.map(r => {
    const hoursSinceBase = (new Date(r.timestamp).getTime() - baseTime) / (1000 * 60 * 60);
    return { x: hoursSinceBase, y: r.tds };
  });

  const { slope, intercept } = linearRegression(dataPoints);
  
  const lastPointTime = dataPoints[dataPoints.length - 1].x;
  const targetX = lastPointTime + hoursAhead;
  
  let predicted = slope * targetX + intercept;
  return Math.max(0, predicted);
};

export const predictTomorrow = (readings) => {
  return predictTDS(readings, 24);
};

export const predictNextWeek = (readings) => {
  return predictTDS(readings, 168);
};

/**
 * Analyzes the trend of readings.
 * @param {Array} readings - Array of recent reading objects.
 * @returns {string} 'improving', 'stable', or 'degrading'
 */
export const getTrend = (readings) => {
  if (!readings || readings.length < 2) return 'stable';
  
  const recent = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).slice(-30);
  const baseTime = new Date(recent[0].timestamp).getTime();
  
  const dataPoints = recent.map(r => {
    const hours = (new Date(r.timestamp).getTime() - baseTime) / (1000 * 60 * 60);
    return { x: hours, y: r.tds };
  });

  const { slope } = linearRegression(dataPoints);
  
  if (slope < -0.5) return 'improving';
  if (slope > 0.5) return 'degrading';
  return 'stable';
};
