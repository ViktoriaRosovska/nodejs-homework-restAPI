const Joi = require("joi");
const { emailRegexp, passwordRegexp } = require("../utils/constants");

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  phone: Joi.string(),
  email: Joi.string().email(),
  favorite: Joi.bool(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.bool().required(),
});

const userSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).pattern(passwordRegexp).required().messages({
    "string.pattern.base": "Must be at least 8 symbols, has 1 upper character, 1 number and one special symbol",
  }),
});

module.exports = {
  contactSchema,
  favoriteSchema,
  userSchema,
};
