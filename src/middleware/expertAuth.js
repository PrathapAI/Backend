import jwt from 'jsonwebtoken';

// Middleware to authenticate experts
export const authenticateExpert = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if token is for an expert
    if (decoded.type !== 'expert') {
      return res.status(403).json({ error: 'Invalid token type. Expert access required.' });
    }

    req.expertId = decoded.expertId;
    req.email = decoded.email;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default { authenticateExpert };
