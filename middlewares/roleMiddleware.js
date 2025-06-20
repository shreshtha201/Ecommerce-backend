const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: insufficient rights' });
    }

    next();
  };
};

module.exports = roleMiddleware;
