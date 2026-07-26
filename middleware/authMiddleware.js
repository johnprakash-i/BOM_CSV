const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT Bearer token from the Authorization header.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 *
 * On success, attaches the decoded user info to req.user and calls next().
 */
const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Use Authorization: Bearer <token>',
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists',
      });
    }

    // Attach user info to the request object
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again',
      });
    }

    console.error('Auth middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
    });
  }
};

module.exports = { protect };
