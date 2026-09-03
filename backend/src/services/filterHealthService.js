/**
 * Calculates filter health based on user's TDS readings history.
 * @param {Array} readings - All readings for the user.
 * @param {number} filterLifespanDays - Estimated lifespan of the filter in days.
 * @returns {Object} Filter health data.
 */
export const getFilterHealth = (readings, filterLifespanDays = 180) => {
  if (!readings || readings.length === 0) {
    return { healthPercent: 100, estimatedRemainingDays: filterLifespanDays, status: 'Healthy', baseline: 0, currentAvg: 0 };
  }

  const sortedReadings = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const firstReadingTime = new Date(sortedReadings[0].timestamp).getTime();
  
  // Baseline: average of first 7 days
  const baselineReadings = sortedReadings.filter(r => {
    return (new Date(r.timestamp).getTime() - firstReadingTime) <= 7 * 24 * 60 * 60 * 1000;
  });
  
  let baseline = sortedReadings[0].tds;
  if (baselineReadings.length > 0) {
    baseline = baselineReadings.reduce((sum, r) => sum + r.tds, 0) / baselineReadings.length;
  }

  // Current: average of last 24 hours
  const lastReadingTime = new Date(sortedReadings[sortedReadings.length - 1].timestamp).getTime();
  const currentReadings = sortedReadings.filter(r => {
    return (lastReadingTime - new Date(r.timestamp).getTime()) <= 24 * 60 * 60 * 1000;
  });
  
  let currentAvg = sortedReadings[sortedReadings.length - 1].tds;
  if (currentReadings.length > 0) {
    currentAvg = currentReadings.reduce((sum, r) => sum + r.tds, 0) / currentReadings.length;
  }

  if (baseline === 0) baseline = 1;

  const tdsIncreaseRatio = Math.max(0, (currentAvg - baseline) / baseline);
  
  let healthPercent = 100 - (tdsIncreaseRatio * 200);
  healthPercent = Math.max(0, Math.min(100, healthPercent));

  const estimatedRemainingDays = Math.round((healthPercent / 100) * filterLifespanDays);
  
  let status = 'Healthy';
  if (healthPercent < 40) {
    status = 'Replace Soon';
  } else if (healthPercent <= 70) {
    status = 'Monitor';
  }

  return { healthPercent, estimatedRemainingDays, status, baseline, currentAvg };
};
