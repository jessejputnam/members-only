const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const Message = require("../models/message");
const User = require("../models/user");

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
router.get("/sign-up", function (req, res) {
  res.render("sign-up", { title: "Register" });
});

// POST request for sign up
router.post("/sign-up", [
  // Validate and sanitize fields
  body("email", "Must be valid email address")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .normalizeEmail(),
  body("fname", "First name is required").trim().isLength({ min: 1 }),
  body("lname", "Last name is required").trim().isLength({ min: 1 }),
  body(
    "pass",
    "Password must be at least 8 characters, and contain at least one of each: lowercase, uppercase, and number"
  )
    .trim()
    .isStrongPassword(),
  body("passConfirm", "Password confirmation must match password")
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.pass),

  // Process request after validation/sanitization
  (req, res, next) => {
    // Check if user already exists
    User.findOne({ email: req.body.email }).exec((err, found_user) => {
      if (err) {
        return next(err);
      }
      if (found_user) {
        // User found, redirect back to form
        alert("Email already in use");
        res.redirect("log-in");
      }
    });

    // Extract validation errors from request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, rerender
      res.render("sign-up", { title: "Register", errors: errors.array() });
    }

    // Create User obj with data
    // Hash password
    bcrypt.hash(req.body.pass, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const user = new User({
        email: req.body.email,
        firstname: req.body.fname,
        lastname: req.body.lname,
        admin: false,
        membership: "basic",
        password: hashedPassword
      });

      user.save((err) => {
        if (err) {
          return next(err);
        }

        // Successful, redirect to login
        res.redirect("log-in");
      });
    });
  }
]);

// router.post("/sign-up", function (req, res, next) {
//   bcrypt.hash(req.body.pass, 10, (err, hashedPassword) => {
//     if (err) {
//       return next(err);
//     }
//     const user = new User({
//       email: req.body.email
//     });
//   });
// });

// GET request for log in
router.get("/login", function (req, res) {});

// POST request for log in
router.post("/login", function (req, res) {});

// GET request for premium access
router.get("/:id/premium", function (req, res) {});

// POST request for premium access
router.post("/:id/premium", function (req, res) {});

// GET request for admin access
router.get("/:id/admin", function (req, res) {});

// POST request for admin access
router.post("/:id/admin", function (req, res) {});

module.exports = router;
