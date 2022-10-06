const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true, maxLength: 30 },
  lastname: { type: String, required: true, maxLength: 30 },
  username: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false },
  membership: {
    type: String,
    required: true,
    enum: ["basic", "premium"],
    default: "basic"
  }
});

module.exports = mongoose.model("User", UserSchema);
