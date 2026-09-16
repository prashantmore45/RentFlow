import { supabase } from '../supabase.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token using Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Supabase auth error:', error?.message);
      return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }
    
    req.user = {
      id: user.id,
      email: user.email,
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(403).json({ error: 'Forbidden - Token verification failed' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
        };
      }
    }
    next();
  } catch (error) {
    // Optional auth - just continue without user
    next();
  }
};
