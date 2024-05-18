// const User = require("../models/user.models");

const getUser = (req, res) => {
  res.render("index", { title: "Home page" });
};

const addUser = (req, res) => {
  res.render("add_user", { title: "Add User page" });
};

module.exports = {
  getUser,
  addUser,
};
