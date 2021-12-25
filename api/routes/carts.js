// Import required dependencies
const express = require("express");
const router = express.Router();

// Import controller file
const CartController = require("../controllers/carts");

// Import authentication middleware
const checkAuth = require("../../middleware/checkAuth");

// (POST) save a new product to the user cart
router.post("/", checkAuth, CartController.postCart);

// (GET) retrieve the users cart
router.get("/", checkAuth, CartController.getCart);

// (UPDATE) cart
router.patch("/", checkAuth, CartController.updateCart);

module.exports = router;
