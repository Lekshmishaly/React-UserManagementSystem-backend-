const User = require("../model/userModel");
const generateAccessToken = require("../utils/generateaccessToken");
const bcrypt = require("bcrypt");

//create user ====

async function createUser(req, res) {
  try {
    const { userName, email, mobile, password, image } = req.body;
    const passwordHashed = await bcrypt.hash(password, 10);
    //check if exist
    const existingUser = await User.findOne({ email: req.body.email });
    const existingMobile = await User.findOne({ mobile: req.body.mobile });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    } else if (existingMobile) {
      return res.status(400).json({ message: "Phone Number already exists" });
    }
    const newUser = new User({
      name: userName,
      email: email,
      mobile: mobile,
      password: passwordHashed,
      image,
    });

    const userData = await newUser.save();
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "Registration Failed" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Registration Successfull" });
  } catch (err) {
    console.log(err);
  }
}

//login   ======================

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email, isAdmin: false });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        userData.password = undefined;

        const token = generateAccessToken(userData._id);

        res.cookie("accessToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        return res
          .status(200)
          .json({ success: true, message: "Login Successfull", userData });
      }
      return res.status(400).json({ success: false, message: "Login Failed " });
    }
    return res.status(404).json({ success: false, message: "Login Failed " });
  } catch (error) {
    console.log(error);
  }
}

//user update

async function updateUser(req, res) {
  // console.log("========call reached=========");

  try {
    const { _id, editEmail, editName, editMobile, editImage } = req.body;

    const updateData = await User.findByIdAndUpdate(
      { _id },
      {
        name: editName,
        email: editEmail,
        mobile: editMobile,
        image: editImage,
      },
      { new: true }
    );

    if (!updateData) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to update" });
    }
    updateData.password = undefined;

    return res
      .status(200)
      .json({ success: true, message: "Updated Successfuly", updateData });
  } catch (error) {
    console.log(error);
  }
}

async function logout(req, res) {
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: new Date(0),
  });

  return res.status(200).json({ success: true, message: "Logout Successful" });
}

module.exports = {
  createUser,
  loginUser,
  updateUser,
  logout,
};
