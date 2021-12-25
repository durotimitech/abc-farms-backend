const constants = require("../utilities/constants");

module.exports = function (req, res, next) {
  if (req.user.accessLevel !== constants.accessLevels.ADMIN)
    return res.status(403).send("Access Denied");
  next();
};
