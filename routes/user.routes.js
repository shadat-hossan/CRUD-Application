const express = require("express");
const path = require("path");
const multer = require("multer");
const User = require("../models/user.models");

const {
  getUser,
  addUser,
  postUsear,
  editGetUser,
  userUpdate,
  deleteUser,
} = require("../controlars/user.controlars");

const router = express.Router();

// Upload Image
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

router.get("/", getUser);

router.get("/add", addUser);

router.post("/add", upload, postUsear);

router.get("/edit/:id", editGetUser);

router.post("/update/:id", upload, userUpdate);

router.delete("/delete/:id", deleteUser);

module.exports = router;
