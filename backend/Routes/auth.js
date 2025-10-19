const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

// Rate limiter to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: '⚠️ Too many login attempts. Try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Generate tokens helper
function generateAccessToken(username) {
  return jwt.sign(
    { username },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m', // Short-lived access token (15 minutes)
      issuer: 'nafman-portfolio-api',
      audience: 'admin-client'
    }
  );
}

function generateRefreshToken(username) {
  return jwt.sign(
    { username },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d', // Longer refresh token (7 days)
      issuer: 'nafman-portfolio-api',
      audience: 'admin-client'
    }
  );
}

// In-memory storage for refresh tokens (use DB in production)
const refreshTokens = new Set();

// Login route
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Constant-time username check - ensure same length first
    if (
      !username ||
      Buffer.byteLength(username) !== Buffer.byteLength(process.env.ADMIN_USERNAME) ||
      !crypto.timingSafeEqual(Buffer.from(username), Buffer.from(process.env.ADMIN_USERNAME))
    ) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, process.env.ADMIN_HASHED_PASSWORD);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);

    refreshTokens.add(refreshToken); // Store refresh token

    // Set cookies with secure flags
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Refresh token route — issue new access token
router.post('/refresh_token', (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(401).json({ message: 'Refresh token invalid or missing' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
      issuer: 'nafman-portfolio-api',
      audience: 'admin-client'
    });

    if (decoded.username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: 'Unauthorized refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(decoded.username);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ message: 'Access token refreshed' });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout route — clear tokens
router.post('/logout', (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
