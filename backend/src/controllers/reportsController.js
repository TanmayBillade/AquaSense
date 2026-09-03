import Reading from '../models/Reading.js';
import { getQualityScore } from '../services/qualityService.js';

export const getWeeklyReport = async (req, res, next) => {
  try {
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - (28 * 24 * 60 * 60 * 1000));

    const readings = await Reading.find({
      userId: req.user.id,
      timestamp: { $gte: fourWeeksAgo }
    }).sort({ timestamp: 1 });

    const weeks = [1, 2, 3, 4].map(w => {
      const weekEnd = new Date(now.getTime() - ((4 - w) * 7 * 24 * 60 * 60 * 1000));
      const weekStart = new Date(weekEnd.getTime() - (7 * 24 * 60 * 60 * 1000));
      return { weekNum: w, start: weekStart, end: weekEnd, readings: [] };
    });

    readings.forEach(r => {
      const rTime = new Date(r.timestamp).getTime();
      const week = weeks.find(w => rTime >= w.start.getTime() && rTime <= w.end.getTime());
      if (week) {
        week.readings.push(r.tds);
      }
    });

    const weeklyReports = weeks.map((week, index) => {
      const { readings: tdsValues } = week;
      let avgTds = 0, maxTds = 0, minTds = 0, medianTds = 0, score = 0, trend = 'stable', recommendation = 'No data available.';
      
      if (tdsValues.length > 0) {
        avgTds = tdsValues.reduce((a, b) => a + b, 0) / tdsValues.length;
        maxTds = Math.max(...tdsValues);
        minTds = Math.min(...tdsValues);
        
        const sorted = [...tdsValues].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        medianTds = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        
        score = getQualityScore(avgTds);
        
        if (avgTds <= 50) recommendation = 'Excellent water quality.';
        else if (avgTds <= 150) recommendation = 'Good water quality. Routine maintenance recommended.';
        else if (avgTds <= 300) recommendation = 'Moderate quality. Monitor closely.';
        else recommendation = 'Poor water quality. Filter replacement highly recommended.';
      }

      if (index > 0 && weeks[index - 1].readings.length > 0 && tdsValues.length > 0) {
        const prevAvg = weeks[index - 1].readings.reduce((a, b) => a + b, 0) / weeks[index - 1].readings.length;
        if (avgTds > prevAvg * 1.05) trend = 'degrading';
        else if (avgTds < prevAvg * 0.95) trend = 'improving';
      }

      return {
        week: week.weekNum,
        startDate: week.start,
        endDate: week.end,
        readingCount: tdsValues.length,
        avgTds: Math.round(avgTds),
        maxTds: Math.round(maxTds),
        minTds: Math.round(minTds),
        medianTds: Math.round(medianTds),
        qualityScore: Math.round(score),
        trend,
        recommendation
      };
    });

    res.status(200).json({
      success: true,
      reports: weeklyReports
    });
  } catch (error) {
    next(error);
  }
};
