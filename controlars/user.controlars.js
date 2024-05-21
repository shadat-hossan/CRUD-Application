const User = require("../models/user.models");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const { trace } = require("console");

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

const editGetUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(req.params.id);

    if (user == null) {
      res.redirect("/");
    } else {
      res.render("edit_user", {
        title: "Edit User",
        user: user,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userUpdate = async (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log("Error deleting old image: ", err);
    }
  } else {
    new_image = req.body.old_image;
  }

  try {
    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });

    req.session.message = {
      type: "success",
      message: "User Updated Successfully!",
    };
    res.redirect("/");
  } catch (err) {
    console.log("Error updating user: ", err);
    res.json({ message: err.message, type: "danger" });
  }
};

const deleteUser = async (req, res) => {
  let id = req.params.id;
  await User.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.statSync("./uploads" + result.image);
      } catch (error) {
        console.log(error);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "info",
        message: "User Delete Successfully!",
      };
      res.redirect("/");
    }
  });
};

module.exports = {
  getUser,
  addUser,
  postUsear,
  editGetUser,
  userUpdate,
  deleteUser,
};
