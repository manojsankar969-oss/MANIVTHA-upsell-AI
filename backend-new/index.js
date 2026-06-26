const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { initDb } = require('./config/db');
const apiRouter = require('./routes/api');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 5001;

// 1. CORS Middleware (Must run before routes)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Security and Logging Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());

// 3. Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 4. API Routes
app.use('/api', apiRouter);

// 5. Global Error Handling Middleware (Must be registered last)
app.use(errorHandler);

// 6. Database Initialization and Server Bootstrap
const bootstrap = async () => {
  try {
    // Run database table checks
    await initDb();

    // Start Server
    const server = app.listen(port, () => {
      console.log(`✅ Upgradeable backend is ACTIVE and listening on port ${port}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Retrying with a different port or kill the blocking process.`);
      } else {
        console.error('❌ Server bootstrap error:', err);
      }
    });

  } catch (err) {
    console.error('❌ Failed to bootstrap the backend server:', err);
    process.exit(1);
  }
};

bootstrap();

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at Promise:', promise, 'reason:', reason);
});
