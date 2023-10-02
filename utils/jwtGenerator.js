const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const jwtGenetator = (userId) => {
  const payload = {
    id: userId,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  try {
    jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.log(error.message);
  }
  return token;
};

module.exports = jwtGenetator;
