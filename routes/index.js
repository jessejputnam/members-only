const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const Message = require("../models/message");
const User = require("../models/user");

const auth_controller = require("../controllers/authController");

// GET request for home page.
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

// GET request for premium access
router.get("/:id/premium", function (req, res) {});

// POST request for premium access
router.post("/:id/premium", function (req, res) {});

// GET request for admin access
router.get("/:id/admin", function (req, res) {});

// POST request for admin access
router.post("/:id/admin", function (req, res) {});

module.exports = router;
