// Import required dependencies
const express = require("express");
const router = express.Router();

// Import controller file
const ProductsController = require("../controllers/products");

// Import authentication middleware
const checkAuth = require("../../middleware/checkAuth");
const admin = require("../../middleware/admin");

// (POST) save a new product to the database
router.post("/", [checkAuth, admin], ProductsController.postProduct);

// (GET) retrieve all products from the database
router.get("/", ProductsController.getProducts);

// (GET) single product
router.get("/:productId", ProductsController.getSingleProduct);

// (UPDATE) product
router.patch(
  "/:productId",
  [checkAuth, admin],
  ProductsController.updateProduct
);

module.exports = router;
