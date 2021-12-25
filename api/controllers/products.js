// Import dependencies
const { _response } = require("../../utilities/response");
const { getDate } = require("../../utilities/utilities");
const Queries = require("../database/queries");

// (POST) save a new product
exports.postProduct = async (req, res, next) => {
  try {
    let data = {
      addedBy: req.user.userId,
      productTitle: req.body.productTitle,
      productPrice: req.body.productPrice,
      productQuantity: req.body.productQuantity,
      productDescription: req.body.productDescription,
      productImageUrl: req.body.productImageUrl,
      createdAt: getDate(),
      updatedAt: getDate(),
    };

    await Queries.insertOne({ table: "products", data });

    return _response({ statusCode: 201, res, result: "success" });
  } catch (e) {
    return _response({ statusCode: 500, res, result: e });
  }
};

// (GET) retrieve all products
exports.getProducts = async (req, res, next) => {
  try {
    const response = await Queries.selectAllAndOrder({
      table: "products",
      orderBy: "createdAt",
      direction: "DESC",
    });
    const result = {
      count: response.length,
      products: response,
    };
    _response({ statusCode: 200, res, result: result });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (GET) retrieve single product
exports.getSingleProduct = async (req, res, next) => {
  try {
    // const id = req.params.productId;
    // Product.findById(id)
    //   .exec()
    //   .then((result) => _response({ statusCode: 200, res, result }))
    //   .catch((e: any) => _response(500, res, e));
  } catch (e) {
    _response(500, res, e);
  }
};

// (UPDATE) product
exports.updateProduct = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      updatedAt: getDate(),
    };

    const product = await Queries.selectAllWith1Condition({
      table: "products",
      condition: { productId: req.params.productId },
    });

    if (!product[0]) return _response(401, res, "Product not found!");

    await Queries.updateOne({
      table: "products",
      condition: { productId: req.params.productId },
      data,
    });

    _response({ statusCode: 201, res, result: "success" });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

/*
CREATE TABLE products (
  `productId` INT NOT NULL AUTO_INCREMENT,
  `productTitle` VARCHAR(100) NOT NULL,
  `productPrice` FLOAT NOT NULL,
  `productQuantity` INT NOT NULL,
  `productDescription` VARCHAR(500) NOT NULL,
  `productImageUrl` VARCHAR(500) NOT NULL,
  `isDeleted` TINYINT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `addedBy` INT NOT NULL,
  PRIMARY KEY (`productId`));
*/
