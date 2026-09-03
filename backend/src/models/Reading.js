import mongoose from 'mongoose';

const ReadingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tds: {
    type: Number,
    required: true,
    min: 0
  },
  temperature: {
    type: Number,
    default: 25
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    deviceId: String,
    location: String
  }
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'minutes'
  }
});

ReadingSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('Reading', ReadingSchema);
