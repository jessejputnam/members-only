const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const Message = require("../models/message");
const User = require("../models/user");

const auth_controller = require("../controllers/authController");
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/* -------------------- MESSAGES -------------------- */

//! GET request for list messages.
router.get("/", function (req, res, next) {
  // Message.find()
  //   .sort({ timestamp: -1 })
  //   .exec(function (err, list_messages) {
  //     if (err) {
  //       return next(err);
  //     }
  //     res.render("index", { title: "ExcluSieve", message_list: list_messages });
  //   });
  res.render("index", { title: "ExcluSieve" });
});

router.get("/add-post", message_controller.add_message_get);

router.post("/add-post", message_controller.add_message_post);

/* ------------------- SIGNUP/SIGNIN ------------------- */

// GET request for sign up
router.get("/sign-up", auth_controller.signup_get);

// POST request for sign up
router.post("/sign-up", auth_controller.signup_post);

// GET request for log in
router.get("/login", auth_controller.login_get);

// POST request for log in
router.post("/login", auth_controller.login_post);

// GET request for logout
router.get("/logout", auth_controller.logout_get);

/* ----------------- MEMBERSHIP ACCESS ----------------- */

// GET request for profile
router.get("/profile", user_controller.profile_get);

// POST request for premium membership
router.post("/member", user_controller.member_post);

//! POST request for admin access
router.post("/admin", function (req, res) {});

module.exports = router;
