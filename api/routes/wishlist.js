// Import required dependencies
const express = require("express");
const router = express.Router();

// Import controller file
const WishlistController = require("../controllers/wishlist");

// Import authentication middleware
const checkAuth = require("../../middleware/checkAuth");

// (POST) save a new product to the user wishlist
router.post("/", checkAuth, WishlistController.postWishlist);

// (GET) retrieve the users wishlist
router.get("/", checkAuth, WishlistController.getWishlist);

// (UPDATE) wishlist
router.patch("/", checkAuth, WishlistController.updateWishlist);

module.exports = router;

