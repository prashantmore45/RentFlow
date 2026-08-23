import Joi from 'joi';

// Room validation schemas
export const createRoomSchema = Joi.object({
  title: Joi.string().min(3).max(150).required().trim(),
  description: Joi.string().min(10).max(2000).optional().trim(),
  location: Joi.string().min(3).max(200).required().trim(),
  price: Joi.number().positive().required(),
  property_type: Joi.string().max(50).required().trim(),
  tenant_preference: Joi.string().max(50).required().trim(),
  contact_number: Joi.string().max(20).required().trim(),
  image_url: Joi.string().uri().optional().allow(null, ''),
  amenities: Joi.array().items(Joi.string()).optional(),
  max_occupants: Joi.number().positive().integer().optional()
});

export const updateRoomSchema = Joi.object({
  title: Joi.string().min(3).max(150).optional().trim(),
  description: Joi.string().min(10).max(2000).optional().trim(),
  location: Joi.string().min(3).max(200).optional().trim(),
  price: Joi.number().positive().optional(),
  property_type: Joi.string().max(50).optional().trim().allow(null, ''),
  tenant_preference: Joi.string().max(50).optional().trim().allow(null, ''),
  contact_number: Joi.string().max(20).optional().trim().allow(null, ''),
  image_url: Joi.string().uri().optional().allow(null, ''),
  amenities: Joi.array().items(Joi.string()).optional(),
  max_occupants: Joi.number().positive().integer().optional()
});

// Application validation schemas
export const createApplicationSchema = Joi.object({
  room_id: Joi.string().required(),
  message: Joi.string().min(10).max(1000).required().trim()
});

export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected').required()
});

// Chat validation schemas
export const createMessageSchema = Joi.object({
  room_id: Joi.string().required(),
  receiver_id: Joi.string().required(),
  content: Joi.string().min(1).max(5000).required().trim()
});

// Profile validation schemas
export const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).optional().trim().allow(null, ''),
  bio: Joi.string().max(500).optional().trim().allow(null, ''),
  avatar_url: Joi.string().uri().optional().allow(null, ''),
  phone: Joi.string().pattern(/^[0-9\s\-\+\(\)]+$/).optional(),
  location: Joi.string().max(100).optional().trim()
});

// Review validation schemas
export const createReviewSchema = Joi.object({
  room_id: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(10).max(1000).required().trim()
});

// Favorite validation schemas
export const createFavoriteSchema = Joi.object({
  room_id: Joi.string().required()
});

// Validation middleware factory
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors 
      });
    }

    req.validatedBody = value;
    next();
  };
};
