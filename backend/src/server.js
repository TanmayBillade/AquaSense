import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.js';
import readingsRoutes from './routes/readings.js';
import reportsRoutes from './routes/reports.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Health check (used by Render to verify the service is alive)
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/', (req, res) => res.json({ message: 'AquaSense API is running' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/readings', readingsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
