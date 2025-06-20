const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from headers
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId, email, role etc.
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};


module.exports = authMiddleware;
