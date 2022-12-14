const User = require("../models/user");

exports.profile_get = (req, res, next) => {
  res.render("profile", { title: "Profile" });
};

exports.member_post = (req, res, next) => {
  if (req.body["member-pass"] === "access") {
    User.findByIdAndUpdate(
      req.user._id,
      { membership: "premium" },
      function (err, docs) {
        if (err) {
          return next(err);
        }

        // Sucessful, redirect to profile
        res.redirect("/profile");
      }
    );
  } else {
    res.render("profile", {
      title: "Profile",
      error: "Incorrect 'access' code"
    });
  }
};

exports.admin_post = (req, res, next) => {
  if (req.body["admin-pass"] === "admin1200") {
    User.findByIdAndUpdate(req.user._id, { admin: true }, function (err, docs) {
      if (err) {
        return next(err);
      }
      // Successful, redirect to profile
      res.redirect("/profile");
    });
  }
};
