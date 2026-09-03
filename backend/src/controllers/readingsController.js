import Reading from '../models/Reading.js';
import { checkAlerts } from '../services/alertService.js';
import { getQualityScore, getQualityStatus } from '../services/qualityService.js';

export const createReading = async (req, res, next) => {
  try {
    const { tds, temperature, deviceId } = req.body;
    
    const reading = await Reading.create({
      userId: req.user.id,
      tds,
      temperature,
      metadata: {
        deviceId: deviceId || req.user.device?.deviceId || 'unknown',
        location: req.user.device?.location || 'unknown'
      }
    });

    const previousReadings = await Reading.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(5);

    const alerts = await checkAlerts(req.user.id, reading, req.user.settings, previousReadings);

    res.status(201).json({
      success: true,
      reading,
      alerts
    });
  } catch (error) {
    next(error);
  }
};

export const getLatest = async (req, res, next) => {
  try {
    const reading = await Reading.findOne({ userId: req.user.id }).sort({ timestamp: -1 });
    
    if (!reading) {
      return res.status(404).json({ success: false, message: 'No readings found' });
    }

    const score = getQualityScore(reading.tds);
    const quality = getQualityStatus(score);

    res.status(200).json({
      success: true,
      reading: {
        ...reading.toObject(),
        qualityScore: score,
        qualityStatus: quality
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 50, sortBy = 'timestamp', sortOrder = 'desc' } = req.query;
    
    const query = { userId: req.user.id };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const readings = await Reading.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
      
    const totalCount = await Reading.countDocuments(query);

    const enrichedReadings = readings.map(r => {
      const score = getQualityScore(r.tds);
      return {
        ...r.toObject(),
        qualityScore: score,
        qualityStatus: getQualityStatus(score)
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedReadings.length,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      readings: enrichedReadings
    });
  } catch (error) {
    next(error);
  }
};
