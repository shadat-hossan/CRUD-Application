const express = require("express");
const router = express.Router();

const { getUser, addUser } = require("../controlars/user.controlars");

router.get("/", getUser);

router.get("/add", addUser);

module.exports = router;
