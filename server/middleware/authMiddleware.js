import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // User was deleted from DB but token is still valid
        return res.status(401).json({ message: 'User account no longer exists. Please log in again.' });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired. Please log in again.' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
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
