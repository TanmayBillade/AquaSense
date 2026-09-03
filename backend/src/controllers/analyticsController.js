import Reading from '../models/Reading.js';
import Alert from '../models/Alert.js';
import { getFilterHealth as calculateFilterHealth } from '../services/filterHealthService.js';
import { predictTomorrow, predictNextWeek, getTrend } from '../services/predictionService.js';
import { checkFilterAlert } from '../services/alertService.js';

export const getFilterHealth = async (req, res, next) => {
  try {
    const readings = await Reading.find({ userId: req.user.id }).sort({ timestamp: 1 });
    
    const filterHealth = calculateFilterHealth(readings);
    
    await checkFilterAlert(req.user.id, filterHealth);

    res.status(200).json({
      success: true,
      filterHealth
    });
  } catch (error) {
    next(error);
  }
};

export const getPrediction = async (req, res, next) => {
  try {
    const readings = await Reading.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(200);

    const tomorrow = predictTomorrow(readings);
    const nextWeek = predictNextWeek(readings);
    const trend = getTrend(readings);

    const trendData = readings.slice(0, 30).map(r => ({
      timestamp: r.timestamp,
      tds: r.tds
    })).reverse();

    res.status(200).json({
      success: true,
      prediction: {
        tomorrow: Math.round(tomorrow),
        nextWeek: Math.round(nextWeek),
        trend,
        trendData
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = 'false' } = req.query;
    
    const query = { userId: req.user.id };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Alert.countDocuments(query);
    const unreadCount = await Alert.countDocuments({ userId: req.user.id, read: false });

    res.status(200).json({
      success: true,
      count: alerts.length,
      totalCount,
      unreadCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      alerts
    });
  } catch (error) {
    next(error);
  }
};

export const markAlertRead = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    if (alert.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this alert' });
    }

    alert.read = true;
    await alert.save();

    res.status(200).json({
      success: true,
      alert
    });
  } catch (error) {
    next(error);
  }
};
