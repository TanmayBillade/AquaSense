import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  device: {
    name: { type: String, default: 'ESP32 TDS Sensor' },
    location: { type: String, default: 'Kitchen' },
    deviceId: { type: String, default: 'ESP32-001' }
  },
  settings: {
    tdsThreshold: { type: Number, default: 500 },
    samplingInterval: { type: Number, default: 30 },
    notifications: {
      tdsAlert: { type: Boolean, default: true },
      filterAlert: { type: Boolean, default: true },
      connectionAlert: { type: Boolean, default: true }
    },
    units: { type: String, default: 'ppm' },
    theme: { type: String, default: 'system' }
  }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export default mongoose.model('User', UserSchema);
