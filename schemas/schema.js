const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  phone: Joi.string(),
  email: Joi.string().email(),
  favorite: Joi.bool(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.bool().required(),
});

module.exports = {
  contactSchema,
  favoriteSchema,
};
