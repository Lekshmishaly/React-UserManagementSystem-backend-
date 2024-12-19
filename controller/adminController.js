const User = require("../model/userModel");
const generateAdminAccessToken = require("../utils/generateAdminAccessToken");
const bcrypt = require("bcrypt");
//admin login
async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const adminData = await User.findOne({ email });
    console.log(adminData);
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (adminData.isAdmin && passwordMatch) {
        adminData.password = undefined;
        //adminAccessToken
        const token = generateAdminAccessToken(adminData._id);
        res.cookie("adminAccessToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        return res.status(200).json({
          success: true,
          message: "Admin Login Successfull",
          adminData,
        });
      }
      return res
        .status(404)
        .json({ success: false, message: "Admin Login Failed" });
    }

    return res
      .status(404)
      .json({ success: false, message: " Admin Login Failed" });
  } catch (error) {
    console.log(error);
  }
}
//fetching users data from DB

async function getAllUsers(req, res) {
  try {
    const collectedDatas = await User.find({ isAdmin: false }).select(
      "-password"
    );
    // console.log(collectedDatas);

    return res.status(200).json({ success: true, collectedDatas });
  } catch (error) {
    console.log(error);
  }
}

//admin will update each users

async function adminEditUsers(req, res) {
  const { id } = req.params;
  const updatedData = {
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    image: req.body.image,
  };
  try {
    if (updatedData) {
      const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
      return res.json({
        success: true,
        message: "Successfully to update user",
        user,
      });
    }
    res.status(404).json({ error: "Failed the update user" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
}
//admin will delete user
async function deleteAdminUser(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      return res
        .status(200)
        .json({ success: true, message: "User successfully deleted", user });
    }
    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete user", error });
  }
}
//Add New user
async function addNewUsers(req, res) {
  const { name, email, mobile, image, password } = req.body;
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      image,
      password: passwordHash,
    });
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "User added successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
}

//admin adminAccessToken distroy
async function adminLogout(req, res) {
  res.cookie("adminAccessToken", "", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: new Date(0),
  });

  return res.status(200).json({ success: true, message: "Logout Successful" });

  //search
}
async function searchUser(req, res) {
  const { search } = req.body;

  try {
    const searchQuery = new RegExp(search);
    // console.log(searchQuery);
    const searchUserdata = await User.find({
      $or: [{ name: { $regex: searchQuery, $options: "i" } }],
      isAdmin: false,
    });
    if (searchUserdata.length != 0) {
      return res.json(searchUserdata);
    } else {
      res.status(400).json({ message: "user not found" });
    }
    console.log(searchUserdata);
  } catch (error) {
    res.status(400).json({ message: "user not found" });
  }
}
module.exports = {
  loginAdmin,
  getAllUsers,
  adminEditUsers,
  deleteAdminUser,
  addNewUsers,
  adminLogout,
  searchUser,
};
