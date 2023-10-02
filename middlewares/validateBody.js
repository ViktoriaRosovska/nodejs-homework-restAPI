const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
      const field = error.details
        .filter((d) => d.type === "any.required")
        .map((d) => d.path.join("."))
        .join(", ");
      const pwdMsg = error.details.filter((d) => d.type === "string.pattern.base");
      if (pwdMsg.length > 0) {
        next(HttpError(400, pwdMsg[0].message));
      } else if (Object.keys(req.body).length === 0) {
        next(HttpError(400, `Missing fields: ${field}`));
      } else {
        next(HttpError(400, `Missing required "${field}" field.`));
      }
    }
    next();
  };
  return func;
};

module.exports = validateBody;
