const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const blogRoutes = require('./routes/blog');
const footballRoutes = require('./routes/football');
const baseballRoutes = require('./routes/baseball');
const hockeyRoutes = require('./routes/hockey');
const rugbyRoutes = require('./routes/rugby');
const basketballRoutes = require('./routes/basketball');
const volleyballRoutes = require('./routes/volleyball');
const aflRoutes = require('./routes/afl');
const formula1Routes = require('./routes/formula1');
const mmaRoutes = require('./routes/mma');
const nflRoutes = require('./routes/nfl');
const { startScheduler, fetchAndStoreSportsData, generateAndStoreContent } = require('./services/schedulerService');
const cron = require('node-cron');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/blog', blogRoutes);
app.use('/api/football', footballRoutes);
app.use('/api/baseball', baseballRoutes);
app.use('/api/hockey', hockeyRoutes);
app.use('/api/rugby', rugbyRoutes);
app.use('/api/basketball', basketballRoutes);
app.use('/api/volleyball', volleyballRoutes);
app.use('/api/afl', aflRoutes);
app.use('/api/formula1', formula1Routes);
app.use('/api/mma', mmaRoutes);
app.use('/api/nfl', nflRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Show current UTC time and cron job times
  const now = new Date();
  console.log(`[INFO] Current UTC time: ${now.toISOString()}`);

  // Start all scheduled jobs (testing schedule: 21:23, 21:25, 21:27 UTC)
  startScheduler();
});
