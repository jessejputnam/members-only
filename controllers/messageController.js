const Message = require("../models/message");

const { body, validationResult } = require("express-validator");

// Display all messages
exports.message_get = (req, res) => {};

// Display add message form
exports.add_message_get = (req, res, next) => {
  res.render("add-post", { title: "Add Post" });
};

// Handle add message on POST
exports.add_message_post = [
  // Validate and sanitize fields
  body("posttitle", "Post must have a title").trim().isLength({ min: 1 }),
  body("newpost", "Message cannot be empty").trim().isLength({ min: 1 }),

  (req, res, next) => {
    // Extract errors from request
    const errors = validationResult(req);

    // Create Message obj with data
    const message = new Message({
      title: req.body.posttitle,
      timestamp: Date.now(),
      displaydate: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      text: req.body.newpost,
      user: `${req.user.firstname} ${req.user.lastname}`
    });

    if (!errors.isEmpty()) {
      // There are errors, render form again
      res.render("add-post", { title: "Add Post", errors });
    } else {
      // Data form is valid
      message.save((err) => {
        if (err) {
          return next(err);
        }
        // Successful
        res.redirect("/");
      });
    }
  }
];
