const express = require("express");
const adminRoute = express.Router();
const adminController = require("../controller/adminController");
const adminAuth = require("../middleware/adminAuth");

adminRoute.post("/login", adminController.loginAdmin);
adminRoute.get("/users", adminAuth.verifyAdmin, adminController.getAllUsers);
adminRoute.put(
  "/editAdmin/:id",
  adminAuth.verifyAdmin,
  adminController.adminEditUsers
);
adminRoute.delete(
  "/deleteAdmin/:id",
  adminAuth.verifyAdmin,
  adminController.deleteAdminUser
);
adminRoute.post("/addUser", adminAuth.verifyAdmin, adminController.addNewUsers);
adminRoute.patch(
  "/adminLogout",
  adminAuth.verifyAdmin,
  adminController.adminLogout
);
adminRoute.post("/search", adminAuth.verifyAdmin, adminController.searchUser);
module.exports = adminRoute;
