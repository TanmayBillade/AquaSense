import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Reading from '../models/Reading.js';
import Alert from '../models/Alert.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aquasense');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Reading.deleteMany();
    await Alert.deleteMany();
    console.log('Cleared existing data.');

    // 1. Create a Test User
    const user = await User.create({
      name: 'Test User',
      email: 'test@aquasense.com',
      password: 'password123',
      device: { name: 'ESP32 TDS Sensor', location: 'Kitchen', deviceId: 'ESP32-001' },
      settings: { tdsThreshold: 500, samplingInterval: 30 }
    });
    console.log(`Test User created: ${user.email}`);

    // 2. Generate 30 days of TDS readings (every 30 mins)
    const readings = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    // Simulate filter degradation: starts at 120, adds 0.5 daily + sinusoidal variance + noise
    let currentTime = new Date(thirtyDaysAgo);
    
    while (currentTime <= now) {
      const daysSinceStart = (currentTime.getTime() - thirtyDaysAgo.getTime()) / (1000 * 60 * 60 * 24);
      
      // Base TDS starts at 120 and increases by 0.5 per day
      const baseTds = 120 + (daysSinceStart * 0.5);
      
      // Daily variation: sin wave peaking in the middle of the day (±20 ppm)
      const hours = currentTime.getHours();
      const dailyVar = Math.sin((hours / 24) * Math.PI * 2) * 20;
      
      // Random noise (±15 ppm)
      const noise = (Math.random() * 30) - 15;
      
      const tdsValue = Math.max(0, baseTds + dailyVar + noise);
      
      // Temp between 22-28
      const tempValue = 22 + (Math.sin((hours / 24) * Math.PI) * 6) + (Math.random() * 2 - 1);

      readings.push({
        userId: user._id,
        tds: parseFloat(tdsValue.toFixed(2)),
        temperature: parseFloat(tempValue.toFixed(1)),
        timestamp: new Date(currentTime),
        metadata: {
          deviceId: 'ESP32-001',
          location: 'Kitchen'
        }
      });

      // Increment by 30 mins
      currentTime = new Date(currentTime.getTime() + (30 * 60 * 1000));
    }

    await Reading.insertMany(readings);
    console.log(`Generated ${readings.length} readings for the last 30 days.`);

    // 3. Generate some sample alerts
    const alerts = [
      {
        userId: user._id,
        type: 'rapid_increase',
        message: 'Rapid increase in TDS detected. Value jumped from ~130 to 180 ppm.',
        tdsValue: 180,
        read: false,
        createdAt: new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000))
      },
      {
        userId: user._id,
        type: 'filter_warning',
        message: 'Filter health is low (38%). Please consider replacing it soon. Estimated days remaining: 68.',
        read: false,
        createdAt: new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000))
      }
    ];

    await Alert.insertMany(alerts);
    console.log(`Generated ${alerts.length} sample alerts.`);

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
