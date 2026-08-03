import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // 1. Prefer Bearer header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback to httpOnly cookie (secure, XSS-safe)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.log('Auth failed: No token provided in headers or cookies.');
    console.log('Headers:', req.headers.authorization);
    console.log('Cookies:', req.cookies);
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('Auth failed: User not found for decoded ID:', decoded.id);
      return res.status(401).json({ message: 'User account no longer exists. Please log in again.' });
    }

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired. Please log in again.' });
  }
};


const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const adminOrLister = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'lister')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized for this action' });
  }
};

export { protect, adminOnly, adminOrLister };
