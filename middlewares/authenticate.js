const { HttpError } = require("../helpers");
const User = require("../models/user.model");
const { checkToken } = require("../utils/jwtGenerator");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const id = checkToken(token);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "User not found"));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = authenticate;
