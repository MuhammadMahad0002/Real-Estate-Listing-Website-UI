import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import connectDB from './config/db.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import visitAgentRoutes from './routes/visitAgentRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visit-agent', visitAgentRoutes);
app.use('/api/customer', customerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Central Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed default admin if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);

      await User.create({
        fullName: 'Super Admin',
        email: 'admin@realestate.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+92-300-0000000',
      });

      console.log('═══════════════════════════════════════════');
      console.log('  DEFAULT ADMIN CREATED');
      console.log('  Email:    admin@realestate.com');
      console.log('  Password: Admin@123');
      console.log('═══════════════════════════════════════════');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
