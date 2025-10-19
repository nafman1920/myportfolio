const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// In-memory blacklist for invalidated tokens (replace with DB/Redis in prod)
const blacklistedTokens = new Set();

exports.authMiddleware = (req, res, next) => {
  let token = null;

  // Try Bearer token first
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'nafman-portfolio-api',
      audience: 'admin-client'
    });

    if (decoded.username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error('❌ Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.logout = (req, res) => {
  let token = null;

  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (token) {
    blacklistedTokens.add(token);
  }

  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};
