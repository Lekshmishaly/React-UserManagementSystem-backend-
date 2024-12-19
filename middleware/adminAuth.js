const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

async function verifyAdmin(req, res, next) {
  try {
    const adminAccessToken = req.cookies.adminAccessToken;

    if (adminAccessToken) {
      const adminVerified = jwt.verify(
        adminAccessToken,
        process.env.ADMIN_ACCESS_KEY
      );

      const AdminData = User.findOne({ _id: adminVerified.id, isAdmin: true });
      if (!AdminData) {
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
module.exports = { verifyAdmin };
