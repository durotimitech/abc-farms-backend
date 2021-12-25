// Import required dependencies
const express = require("express");
const router = express.Router();

//Import controller file
const UsersController = require("../controllers/users");

// Import authentication middleware
const checkAuth = require("../../middleware/checkAuth");
const salesman = require("../../middleware/salesman");
const admin = require("../../middleware/admin");

// (POST) Create a new user in the database
router.post("/", UsersController.createUser);

// (POST) login user
router.post("/login", UsersController.loginUser);

// (PATCH) verify email
router.patch("/verify-email", UsersController.verifyEmail);

// (PATCH) resend verification email
router.patch("/resend-verify-email", UsersController.resendVerifyEmail);

// (PATCH) reset password
router.patch("/reset-password", UsersController.resetPassword);

// (PATCH) change password
router.patch("/change-password", checkAuth, UsersController.changePassword);

// (GET) Get all registered users
router.get("/", [checkAuth, salesman], UsersController.getUsers);

// (GET) Get admins
router.get("/get-admins", [checkAuth, admin], UsersController.getAdmins);

// (PATCH) Admin Update user
router.patch("/admin-update-user", [checkAuth, admin], UsersController.adminUpdateUser);

module.exports = router;
