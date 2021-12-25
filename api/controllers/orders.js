// Import dependencies
const { accessLevels } = require("../../utilities/constants");
const { sendEmail } = require("../../utilities/mailer");
const { _response } = require("../../utilities/response");
const { getDate } = require("../../utilities/utilities");
const Queries = require("../database/queries");

// (POST) create a new order
exports.postOrder = async (req, res, next) => {
  const orderItems = JSON.parse(req.body.orderItems);

  const orderId = await Promise.all(
    orderItems.map(async (item) => {
      const product = await getProduct(item, res);
      checkQuantity(item, product, res);
      const orderTotal = calculateOrderTotal(item, product);
      const orderId = await placeOrder(item, orderTotal, req, res);
      await updateProductQuantity(item, product, res);
      sendEmail({
        emails: [req.user.email, process.env.EMAIL],
        subject: "Your order has been confirmed",
        emailType: "order create",
        content: {},
      });

      return orderId;
    })
  );
  _response({
    statusCode: 201,
    res,
    result: { orderIds: orderId },
  });
};

// (GET) retrieve users orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Queries.selectAllFromJoin2With1conditionAndOrder({
      table1: "orders",
      table2: "products",
      joint1: "productId",
      condition: { userId: req.user.userId },
      orderBy: "orders.createdAt",
      direction: "DESC",
    });

    const result = {
      count: orders.length,
      orders,
    };

    _response({ statusCode: 200, res, result });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (GET) retrieve all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Queries.selectAllFromJoin2AndOrder({
      table1: "orders",
      table2: "products",
      joint1: "productId",
      orderBy: "orders.createdAt",
      direction: "DESC",
    });

    const result = {
      count: orders.length,
      orders,
    };

    _response({ statusCode: 200, res, result });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (GET) retrieve single order
exports.getSingleOrder = async (req, res, next) => {
  try {
    const admins = [accessLevels.ADMIN, accessLevels.SALESMAN];
    // Allow salesman get any order
    if (admins.includes(req.user.accessLevel)) {
      const result = (
        await Queries.selectColumnsFromJoin3With1condition({
          table1: "orders",
          table2: "products",
          table3: "users",
          joint1: "productId",
          joint2: "userId",
          columns: [
            "orders.createdAt",
            "orders.updatedAt",
            "orderId",
            "orderStatus",
            "quantity",
            "total",
            "paymentMethod",
            "orders.productId",
            "productTitle",
            "productPrice",
            "productImageUrl",
            "orders.userId",
            "customerName",
            "email",
            "phone",
          ],
          condition: { orderId: req.params.orderId },
        })
      )[0];
      return _response({ statusCode: 200, res, result });
    }

    return _response({
      statusCode: 403,
      res,
      result: "You are not authorized to view this page!",
    });
  } catch (e) {
    return _response({ statusCode: 500, res, result: e });
  }
};

// (UPDATE) order
exports.updateOrder = async (req, res, next) => {
  try {
    const admins = [accessLevels.ADMIN, accessLevels.SALESMAN];
    const data = {
      orderStatus: req.body.orderStatus,
      updatedAt: getDate(),
    };

    // Allow salesman update any order
    if (admins.includes(req.user.accessLevel)) {
      await Queries.updateOne({
        table: "orders",
        data,
        condition: { orderId: req.body.orderId },
      });
      return _response({ statusCode: 200, res, result: "success" });
    }

    return _response({
      statusCode: 403,
      res,
      result: "You are not authorized to view this page!",
    });
  } catch (e) {
    return _response({ statusCode: 500, res, result: e });
  }
};

// check that product is in db
const getProduct = async (item, res) => {
  const product = (
    await Queries.selectAllWith1Condition({
      table: "products",
      condition: { productId: item.productId },
    })
  )[0];

  if (!product)
    return _response({
      statusCode: 404,
      res,
      result: `Product not found`,
    });

  return product;
};

// Check that product quantity is still available
const checkQuantity = async (item, product, res) => {
  if (item.quantity > product.productQuantity)
    return _response({
      statusCode: 400,
      res,
      result: `Quantity is less than what is available!`,
    });
};

const calculateOrderTotal = (item, product) => {
  const total = item.quantity * product.productPrice;
  return total;
};

// Place Order
const placeOrder = async (item, orderTotal, req, res) => {
  try {
    const data = {
      userId: req.user.userId,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      customerEmail: req.user.email,
      deliveryMethod: req.body.deliveryMethod,
      productId: item.productId,
      quantity: item.quantity,
      total: orderTotal,
      orderStatus: JSON.stringify([
        {
          orderStatus: "pending",
          updatedAt: getDate(),
        },
      ]),
      paymentMethod: req.body.paymentMethod,
      createdAt: getDate(),
      updatedAt: getDate(),
    };

    const order = await Queries.insertOne({ table: "orders", data });
    return order.insertId;
  } catch (e) {
    return _response({ statusCode: 500, res, result: e });
  }
};

// Update product quantity
const updateProductQuantity = async (item, product, res) => {
  try {
    const data = {
      productQuantity: product.productQuantity - item.quantity,
    };

    await Queries.updateOne({
      table: "products",
      condition: { productId: item.productId },
      data,
    });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

/*
CREATE TABLE orders (
  `orderId` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `customerName` VARCHAR(100) NOT NULL,
  `customerPhone` VARCHAR(20) NOT NULL,
  `deliveryMethod` VARCHAR(20) NOT NULL,
  `productId` INT NOT NULL,
  `quantity` INT NOT NULL,
  `customerEmail` VARCHAR(45) NOT NULL,
  `total` FLOAT NOT NULL,
  `orderStatus` VARCHAR(1000) NOT NULL,
  `paymentMethod` VARCHAR(45) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`orderId`));
*/
