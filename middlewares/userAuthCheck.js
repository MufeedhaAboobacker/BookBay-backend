

import jwt from 'jsonwebtoken';
import HttpError from './httpError.js';
import User from '../models/User.js';

const userAuthCheck = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    // Check if auth header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new HttpError('Authorization token missing or malformed', 401));
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    if (!token) {
      return next(new HttpError('Authentication token not found', 403));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Match user based on ID and role
    const user = await User.findOne({
      _id: decodedToken.user_id,
      role: decodedToken.user_role,
    });

    if (!user) {
      return next(new HttpError('Invalid credentials', 400));
    }

    req.userData = {
      userId: decodedToken.user_id,
      userRole: decodedToken.user_role,
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return next(new HttpError('Authentication failed', 403));
  }
};

export default userAuthCheck;
