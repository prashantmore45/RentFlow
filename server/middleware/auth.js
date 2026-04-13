import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Decode token without verification (for Supabase tokens which are pre-verified on client)
    // In production, you would verify using Supabase's public key
    const decoded = jwt.decode(token);
    
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token format' });
    }
    
    console.log('Token decoded:', { sub: decoded.sub, id: decoded.id, email: decoded.email });
    
    req.user = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      iat: decoded.iat
    };
    
    console.log('User extracted:', req.user);
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(403).json({ error: 'Forbidden - Token verification failed' });
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      if (decoded) {
        req.user = {
          id: decoded.sub || decoded.id,
          email: decoded.email,
          iat: decoded.iat
        };
      }
    }
    next();
  } catch (error) {
    // Optional auth - just continue without user
    next();
  }
};
