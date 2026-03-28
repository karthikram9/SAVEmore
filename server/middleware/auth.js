import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Read Bearer token from Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  // Return 401 if token is missing
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user id to req.userId
    req.userId = decoded.id;
    next();
  } catch (err) {
    // Return 401 if token is invalid
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
