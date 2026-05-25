import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Verify token signature with backend secret
    const decoded = jwt.verify(token, jwtSecret);
    
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token format' });
    }
    
    console.log('Token verified:', { sub: decoded.sub, id: decoded.id, email: decoded.email });
    
    req.user = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      iat: decoded.iat
    };
    
    console.log('User extracted:', req.user);
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    res.status(403).json({ error: 'Forbidden - Token verification failed' });
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET;
      
      if (jwtSecret) {
        try {
          const decoded = jwt.verify(token, jwtSecret);
          if (decoded) {
            req.user = {
              id: decoded.sub || decoded.id,
              email: decoded.email,
              iat: decoded.iat
            };
          }
        } catch (tokenError) {
          // Token invalid/expired - continue without user
          console.warn('Optional token verification failed:', tokenError.message);
        }
      }
    }
    next();
  } catch (error) {
    // Optional auth - just continue without user
    next();
  }
};
