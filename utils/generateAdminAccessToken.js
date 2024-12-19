const jwt = require("jsonwebtoken");
const generateAdminAccessToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.ADMIN_ACCESS_KEY, {
    expiresIn: "7d",
  });
};
module.exports = generateAdminAccessToken;
