const express = require("express");
const userRoute = express.Router();
const userController = require("../controller/userController");
const userAuth = require("../middleware/userAuth");

userRoute.post("/singup", userController.createUser);
userRoute.post("/login", userController.loginUser);
userRoute.post("/edituser", userAuth.verifyUser, userController.updateUser);
userRoute.patch("/logout", userAuth.verifyUser, userController.logout);

module.exports = userRoute;
