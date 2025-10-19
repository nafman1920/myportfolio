const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { forceHttps } = require('./middleware/httpsRedirect');

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Force HTTPS in production
app.use(forceHttps);

// Security headers
app.use(helmet());

// CORS config for frontend with credentials
app.use(cors({
  origin: NODE_ENV === 'production' ? 'https://your-frontend.com' : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/projects', require('./Routes/project'));
app.use('/api/music', require('./Routes/music'));
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/contact', require('./Routes/contact'));

// Root route
app.get('/', (req, res) => {
  res.send('🎧 Portfolio API is running.');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: NODE_ENV === 'production' ? undefined : err.stack
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
