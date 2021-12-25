// Import dependencies
const { _response } = require("../../utilities/response");

// (POST) save a new product to wishlist
exports.postWishlist = (req, res, next) => {
  try {
    const wishlist = new Wishlist({
      _id: new mongoose.Types.ObjectId(),
      userId: req.user._id,
      wishlistItems: req.body.wishlistItems,
    });

    wishlist
      .save()
      .then((result) => _response({ statusCode: 201, res, result }))
      .catch((e) => _response({ statusCode: 500, res, result: e }));
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (GET) retrieve wishlist
exports.getWishlist = (req, res, next) => {
  try {
    Wishlist.find({ userId: req.user._id })
      .exec()
      .then((wishList) => {
        if (wishList.length >= 1) {
          _response({ statusCode: 200, res, result: wishList });
        } else {
          _response({ statusCode: 200, res, result: "no wishlist" });
        }
      })
      .catch((e) => _response({ statusCode: 500, res, result: e }));
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (UPDATE) wishlist
exports.updateWishlist = (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    Wishlist.updateOne({ userId: userId }, { $set: updateOps })
      .exec()
      .then((result) => _response({ statusCode: 200, res, result }))
      .catch((e) => _response({ statusCode: 500, res, result: e }));
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};
