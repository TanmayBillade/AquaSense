import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['tds_high', 'rapid_increase', 'filter_warning', 'connection_lost'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  tdsValue: {
    type: Number
  },
  threshold: {
    type: Number
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

AlertSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Alert', AlertSchema);
