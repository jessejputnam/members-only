const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//! Password validation options?
const UserSchema = new Schema({
  firstname: { type: String, required: true, maxLength: 30 },
  lastname: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true },
  membership: {
    type: String,
    required: true,
    enum: ["basic", "premium"],
    default: "basic"
  }
});

module.exports = mongoose.model("User", UserSchema);
