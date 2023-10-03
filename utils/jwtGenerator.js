const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const jwtGenetator = (userId) => {
  const payload = {
    id: userId,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  return token;
};

const checkToken = (token) => {
  if (!token) {
    throw HttpError(401, "Not logged in..");
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    return id;
  } catch (error) {
    console.log(error.message);
    throw HttpError(401, "Not logged in..");
  }
};
module.exports = {
  jwtGenetator,
  checkToken,
};
