const express = require("express");
const router = express.Router();
const Message = require("../models/message");

/* GET request for home page. */
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

module.exports = router;
