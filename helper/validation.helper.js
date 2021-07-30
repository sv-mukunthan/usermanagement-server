const Joi = require('joi');

module.exports = {

  signUp: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().optional(),
    password: Joi.string().required()
  }),

  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })

}