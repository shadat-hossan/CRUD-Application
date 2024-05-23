const User = require("../models/user.models");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const { trace } = require("console");

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
      image: req.file.filename,
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
  try {
    const id = req.params.id;
    const user = await User.findByIdAndRemove(id);

    if (!user) {
      req.session.message = {
        type: "error",
        message: "User not found!",
      };
      return res.redirect("/");
    }

    if (user.image) {
      const imagePath = path.join(__dirname, "uploads", user.image);
      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
      } catch (error) {
        console.log("Error removing image file:", error);
      }
    }

    req.session.message = {
      type: "info",
      message: "User deleted successfully!",
    };
    res.redirect("/");
  } catch (err) {
    console.log("Error:", err);
    res.json({ message: err.message });
  }
};

module.exports = {
  getUser,
  addUser,
  postUsear,
  editGetUser,
  userUpdate,
  deleteUser,
};
