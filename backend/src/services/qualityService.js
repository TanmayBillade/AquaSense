/**
 * Maps a given TDS value to a 0-100 quality score.
 * @param {number} tds - The Total Dissolved Solids value
 * @returns {number} The quality score (0-100)
 */
export const getQualityScore = (tds) => {
  if (tds >= 0 && tds <= 50) {
    return 100 - (tds / 50) * 5; // 95 to 100
  } else if (tds > 50 && tds <= 150) {
    return 95 - ((tds - 50) / 100) * 15; // 80 to 95
  } else if (tds > 150 && tds <= 300) {
    return 80 - ((tds - 150) / 150) * 20; // 60 to 80
  } else if (tds > 300 && tds <= 500) {
    return 60 - ((tds - 300) / 200) * 30; // 30 to 60
  } else {
    return Math.max(0, 30 - ((tds - 500) / 50));
  }
};

/**
 * Returns a quality status object based on the score.
 * @param {number} score - The quality score (0-100)
 * @returns {Object} { status, color, description }
 */
export const getQualityStatus = (score) => {
  if (score >= 90) {
    return { status: 'Excellent', color: '#4CAF50', description: 'Water quality is excellent, ideal for drinking.' };
  } else if (score >= 70) {
    return { status: 'Good', color: '#2196F3', description: 'Water quality is good and safe for consumption.' };
  } else if (score >= 50) {
    return { status: 'Moderate', color: '#FF9800', description: 'Water quality is moderate. Consider checking the filter soon.' };
  } else if (score >= 30) {
    return { status: 'Poor', color: '#F44336', description: 'Water quality is poor. Filter replacement recommended.' };
  } else {
    return { status: 'Unsafe', color: '#B71C1C', description: 'Water is unsafe for consumption. Replace filter immediately.' };
  }
};
