require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

// console.log(path.join(__dirname, "/public"));
const staticPath = path.join(__dirname, "/public");

const app = express();
const PORT = process.env.PORT || 4000;
const DBURL = process.env.MONGODB;

app.use(express.static(path.join(__dirname, "public")));

// set ejs tamplate Engine
app.set("view engine", "ejs");

app.use(express.static(staticPath));

app.use(express.static("uploads"));

const Route = require("./routes/user.routes.js");

// middleweares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key.",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// router
app.use("", Route);

mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Connected to databse");
    app.listen(PORT, () => {
      console.log(`The Server is runing at http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });
