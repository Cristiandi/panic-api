const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().max(10).required(),
  full_name: Joi.string().min(10).max(100).required()
});

const sendForgottenPasswordEmailSchema = Joi.object({
  email: Joi.string().email().required()
});

module.exports = {
  registerSchema,
  sendForgottenPasswordEmailSchema
};
