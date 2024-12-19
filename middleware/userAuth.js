const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

async function verifyUser(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      const userVerified = jwt.verify(accessToken, process.env.USER_ACCESS_KEY);
      const userData = User.findOne({ _id: userVerified.id, isAdmin: false });
      if (!userData) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      next();
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = { verifyUser };
