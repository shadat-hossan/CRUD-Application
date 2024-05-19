const User = require("../models/user.models");
const multer = require("multer");

// var strage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
//   },
// });
const getUser = async (req, res) => {
  try {
    const users = await User.find().exec();
    res.render("index", {
      title: "Home Page",
      users: users,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

const addUser = (req, res) => {
  res.render("add_user", { title: "User Add page" });
};

const postUsear = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename, // corrected from req.body.filename to req.file.filename
    });

    await user.save();
    req.session.message = {
      type: "success",
      message: "User added successfully!",
    };
    res.redirect("/");
  } catch (error) {
    res.json({ message: error.message, type: "danger" });
  }
};

module.exports = {
  getUser,
  addUser,
  postUsear,
};
