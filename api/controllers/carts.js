// Import dependencies
const { _response } = require("../../utilities/response");
const { getDate } = require("../../utilities/utilities");
const Queries = require("../database/queries");

// (POST) save a new product to cart
exports.postCart = async (req, res, next) => {
  try {
    const data = {
      userId: req.user.userId,
      cartItems: req.body.cartItems,
      createdAt: getDate(),
      updatedAt: getDate(),
    };

    const result = await Queries.insertOne({ table: "carts", data });

    return _response({ statusCode: 201, res, result });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (GET) retrieve cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = (
      await Queries.selectAllWith1Condition({
        table: "carts",
        condition: { userId: req.user.userId },
      })
    )[0];

    if (!cart) return _response({ statusCode: 200, res, result: "no cart" });

    return _response({ statusCode: 200, res, result: cart });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (UPDATE) cart
exports.updateCart = async (req, res, next) => {
  try {
    const data = {
      cartItems: req.body.cartItems,
      updatedAt: getDate(),
    };

    const cart = (
      await Queries.selectAllWith1Condition({
        table: "carts",
        condition: { userId: req.user.userId },
      })
    )[0];

    if (!cart) return _response({ statusCode: 400, res, result: "no cart" });

    await Queries.updateOne({
      table: "carts",
      data,
      condition: { userId: req.user.userId },
    });

    return _response({ statusCode: 201, res, result: "success" });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

/*
CREATE TABLE carts (
  `cartId` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `cartItems` VARCHAR(1000) NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`cartId`),
  UNIQUE INDEX `userId_UNIQUE` (`userId` ASC));
*/
