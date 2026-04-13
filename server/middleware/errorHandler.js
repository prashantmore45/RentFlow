export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Supabase errors
  if (err.status === 406 || err.message?.includes('not found')) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  if (err.status === 409 || err.message?.includes('duplicate')) {
    return res.status(409).json({ error: 'Conflict - duplicate entry' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Default error
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err })
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
