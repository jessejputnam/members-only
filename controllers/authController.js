const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//
exports.signup_get = (req, res, next) => {
  res.render("sign-up", { title: "Register" });
};

exports.signup_post = [
  // Validate and sanitize fields
  body("username", "Must be valid email address")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .normalizeEmail(),
  body("fname", "First name is required").trim().isLength({ min: 1 }),
  body("lname", "Last name is required").trim().isLength({ min: 1 }),
  body(
    "password",
    "Password must be at least 8 characters, and contain at least one of each: lowercase, uppercase, and number"
  )
    .trim()
    .isStrongPassword(),
  body("passConfirm", "Password confirmation must match password")
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password),

  // Process request after validation/sanitization
  async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, rerender
      res.render("sign-up", { title: "Register", errors: errors.array() });
    }

    try {
      // Check if user exists
      const found_user = await User.find({ username: req.body.username });
      if (found_user.length > 0)
        return res.render("sign-up", {
          title: "Register",
          error: "User already exists"
        });

      // Continue registration
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const user = new User({
          username: req.body.username,
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
          res.redirect("/login");
        });
      });
    } catch (err) {
      return next(err);
    }
  }
];

exports.login_get = (req, res, next) => {
  res.render("log-in", { title: "Log In", errors: req.flash("error") });
};

exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
});

exports.logout_get = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
