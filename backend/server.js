const express = require('express');
const path = require('path');
const fs = require('fs');
// const path = require('path');
72904f8 (Add Cloudinary file storage)
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const programmeRoutes = require('./routes/programmeRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const sliderRoutes = require('./routes/sliderRoutes');
const committeeRoutes = require('./routes/committeeRoutes');
const menuRoutes = require('./routes/menuRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const auditRoutes = require('./routes/auditRoutes');
const seoRoutes = require('./routes/seoRoutes');
const faqRoutes = require('./routes/faqRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const formRoutes = require('./routes/formRoutes');

const app = express();

// Connect to Mongo Database
connectDB();

// Security & Logging Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static uploads directory serving
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SEO routes (/sitemap.xml, /robots.txt)
app.use('/', seoRoutes);

// Detailed Health Check Endpoint for Uptime & Operations Monitoring
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const memory = process.memoryUsage();
  
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      host: mongoose.connection.host || 'unknown',
    },
    memoryUsageMB: {
      rss: (memory.rss / (1024 * 1024)).toFixed(2),
      heapTotal: (memory.heapTotal / (1024 * 1024)).toFixed(2),
      heapUsed: (memory.heapUsed / (1024 * 1024)).toFixed(2),
    },
    message: 'DBATU Technological University CMS API is running in production ready mode',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/programmes', programmeRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/forms', formRoutes);

// Static client build serving & SPA Fallback Route Handler
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Handler for API / unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 College CMS Server listening on http://${HOST}:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
