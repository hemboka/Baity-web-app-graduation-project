import e from "express";
import Joi from "joi";

// =========================
// Middleware for all routes
// =========================
export const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.details.map((err) => err.message),
      });
    } else {
      next();
    }
  };
};

// =========================
// Auth: signUp / signIn
// =========================
export const signUpSchema = Joi.object({

  name: Joi.string().min(3).max(30).required(),

  email: Joi.string().email().required(),

  password: Joi.string().pattern(/^[a-zA-Z0-9_]{6,30}$/).required(),

  phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),

  role: Joi.string().valid("chef", "customer").required(),
  nationalID: Joi.alternatives().conditional('role', {
    is: 'chef',
    then: Joi.string().required(),
    otherwise: Joi.optional()
  }),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().pattern(/^[a-zA-Z0-9_]{6,30}$/).required(),
});