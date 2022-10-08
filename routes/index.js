const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/authController");
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/* -------------------- MESSAGES -------------------- */

router.get("/", message_controller.message_list);

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

// POST request for delete message
router.post("/delete-message", message_controller.delete_message);

/* ----------------- MEMBERSHIP ACCESS ----------------- */

// GET request for profile
router.get("/profile", user_controller.profile_get);

// POST request for premium membership
router.post("/member", user_controller.member_post);

router.post("/admin", user_controller.admin_post);

module.exports = router;
