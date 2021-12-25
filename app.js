// Import dependencies
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const usersRoute = require("./api/routes/users");
const productsRoute = require("./api/routes/products");
const cartsRoute = require("./api/routes/carts");
const wishlistRoute = require("./api/routes/wishlist");
const orderRoute = require("./api/routes/orders");

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/orders", orderRoute);

// Handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

module.exports = app;
