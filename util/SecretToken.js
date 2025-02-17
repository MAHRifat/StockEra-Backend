require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id, username, email) => {
  return jwt.sign({ id, username, email }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};