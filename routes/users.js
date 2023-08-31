var express = require("express");
var router = express.Router();

const fetch = require("node-fetch");
require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// ROUTE GET : all users in DB

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ result: true, length: users.length, users: users });
  } catch (error) {
    res.json({
      result: false,
      error: "An error occurred while retrieving users",
    });
  }
});

// ROUTE POST : Sign-up (Admin)
router.post("/signupadmin", (req, res) => {
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        res.json({ result: false, error: "Invalid email format" });
        return;
      }

      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        isAdmin: true,
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// ROUTE POST : Sign-in
router.post("/signin", async (req, res) => {
  try {
    if (!checkBody(req.body, ["email", "password"])) {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }

    const data = await User.findOne({ email: req.body.email });

    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        username: data.username,
        id: data.id,
        token: data.token,
      });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    res
      .status(500)
      .json({ result: false, error: "An error occurred during sign-in" });
  }
});

module.exports = router;
