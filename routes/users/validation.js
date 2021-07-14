const Joi = require("joi");

const validSignup = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
    .required(),

  password: Joi.string().min(6).max(12).required(),
});

const validLogin = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
    .required(),

  password: Joi.string().min(6).max(12).required(),
}).or("email", "password");

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    return next();
  } catch (err) {
    console.log(err);
    next({ status: 400, message: err.message });
  }
};

module.exports = {
  validSignup: async (req, res, next) => {
    return await validate(validSignup, req.body, next);
  },
  validLogin: async (req, res, next) => {
    return await validate(validLogin, req.body, next);
  },
};
