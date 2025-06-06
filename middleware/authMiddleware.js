const jwt = require('jsonwebtoken');

// Usage: authMiddleware() or authMiddleware(['admin']) or authMiddleware(['user', 'admin'])
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;
