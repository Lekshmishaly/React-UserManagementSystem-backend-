const jwt = require("jsonwebtoken");
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.USER_ACCESS_KEY, {
    expiresIn: "7d",
  });
};
module.exports = generateAccessToken;
