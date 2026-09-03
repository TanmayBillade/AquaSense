import Alert from '../models/Alert.js';

/**
 * Checks if current reading warrants any alerts, and creates them if necessary.
 * @param {string} userId - User ID
 * @param {Object} currentReading - The latest reading
 * @param {Object} userSettings - User's settings object
 * @param {Array} previousReadings - Last few readings (e.g., last 5)
 * @returns {Array} Array of created alerts
 */
export const checkAlerts = async (userId, currentReading, userSettings, previousReadings = []) => {
  const alertsCreated = [];
  
  if (!userSettings?.notifications) return alertsCreated;

  const threshold = userSettings.tdsThreshold || 500;

  // 1. High TDS Alert
  if (userSettings.notifications.tdsAlert && currentReading.tds > threshold) {
    const alert = await Alert.create({
      userId,
      type: 'tds_high',
      message: `TDS level (${currentReading.tds} ppm) has exceeded your threshold of ${threshold} ppm.`,
      tdsValue: currentReading.tds,
      threshold
    });
    alertsCreated.push(alert);
  }

  // 2. Rapid Increase Alert
  if (userSettings.notifications.tdsAlert && previousReadings.length >= 2) {
    const sorted = [...previousReadings].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const previousAvg = sorted.slice(1, 4).reduce((sum, r) => sum + r.tds, 0) / Math.min(3, sorted.length - 1);
    
    if (previousAvg > 0 && ((currentReading.tds - previousAvg) / previousAvg) > 0.20) {
      const alert = await Alert.create({
        userId,
        type: 'rapid_increase',
        message: `Rapid increase in TDS detected. Value jumped from ~${Math.round(previousAvg)} to ${currentReading.tds} ppm.`,
        tdsValue: currentReading.tds
      });
      alertsCreated.push(alert);
    }
  }

  return alertsCreated;
};

/**
 * Checks filter health and triggers a warning if needed.
 * @param {string} userId - User ID
 * @param {Object} filterHealth - Data from filterHealthService
 * @returns {Object|null} Created alert or null
 */
export const checkFilterAlert = async (userId, filterHealth) => {
  if (filterHealth.healthPercent < 40) {
    const existingUnread = await Alert.findOne({ userId, type: 'filter_warning', read: false });
    
    if (!existingUnread) {
      return await Alert.create({
        userId,
        type: 'filter_warning',
        message: `Filter health is low (${Math.round(filterHealth.healthPercent)}%). Please consider replacing it soon. Estimated days remaining: ${filterHealth.estimatedRemainingDays}.`
      });
    }
  }
  return null;
};
