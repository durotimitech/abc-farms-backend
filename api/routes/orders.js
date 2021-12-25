// Import required dependencies
const express = require("express");
const router = express.Router();

// Import controller file
const OrderController = require("../controllers/orders");

// Import authentication middleware
const checkAuth = require("../../middleware/checkAuth");
const salesman = require("../../middleware/salesman");

// (POST) create a new Order
router.post("/", checkAuth, OrderController.postOrder);

// (GET) retrieve the users orders
router.get("/", checkAuth, OrderController.getOrders);

// (GET) retrieve all orders
router.get("/allOrders", [checkAuth, salesman], OrderController.getAllOrders);

// (GET) retrieve single order
router.get("/:orderId", checkAuth, OrderController.getSingleOrder);

// (UPDATE) order
router.patch("/:orderId", [checkAuth, salesman], OrderController.updateOrder);

module.exports = router;

