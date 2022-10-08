const Message = require("../models/message");

const { body, validationResult } = require("express-validator");

// Display list messages
exports.message_list = (req, res, next) => {
  Message.find()
    .sort({ timestamp: "descending" })
    .exec(function (err, list_messages) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("index", { title: "ExcluSieve", message_list: list_messages });
    });
};

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

// Handle delete message on POST
exports.delete_message = (req, res, next) => {
  if (req.user.admin) {
    Message.findByIdAndRemove(req.body.messageid, (err) => {
      if (err) {
        return next(err);
      }
      // Success, rerender
      res.redirect("/");
    });
  } else {
    const err = new Error("Unauthorized: non-admin attempted access");
    err.status = 401;
    return next(err);
  }
};
