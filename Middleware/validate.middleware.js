const Joi = require('joi');

// ─── Joi Schema ───────────────────────────────────────────────────────────────

const productSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.base': '"name" must be a string',
    'string.empty': '"name" cannot be empty',
    'any.required': '"name" is required',
  }),

  price: Joi.number().min(0).required().messages({
    'number.base': '"price" must be a number',
    'number.min': '"price" must be 0 or greater',
    'any.required': '"price" is required',
  }),

  description: Joi.string().trim().optional().allow('').messages({
    'string.base': '"description" must be a string',
  }),

  category: Joi.string().trim().required().messages({
    'string.base': '"category" must be a string',
    'string.empty': '"category" cannot be empty',
    'any.required': '"category" is required',
  }),

  inStock: Joi.boolean().optional().messages({
    'boolean.base': '"inStock" must be a boolean',
  }),
});

// ─── Middleware Factory ───────────────────────────────────────────────────────

/**
 * Returns an Express middleware that validates req.body against the
 * product Joi schema.  On failure it short-circuits with 400; on
 * success it replaces req.body with the sanitised Joi output and
 * calls next().
 */
const validateProduct = (req, res, next) => {
  const { error, value } = productSchema.validate(req.body, {
    abortEarly: false,   // collect ALL errors, not just the first
    stripUnknown: true,  // silently drop any extra fields
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Replace body with the sanitised/coerced value from Joi
  req.body = value;
  next();
};

module.exports = { validateProduct };