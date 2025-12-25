import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    req.userId = decoded.userId || decoded.id; // Support both formats
    next();
  } catch {
    res.status(400).json({ error: 'Invalid token' });
  }
}
