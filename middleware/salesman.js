const constants = require("../utilities/constants");

module.exports = (req, res, next) => {

  const admins = [
    constants.accessLevels.ADMIN,
    constants.accessLevels.SALESMAN,
  ];

  if (!admins.includes(req.user.accessLevel))
    return res.status(403).send("Access Denied");
  next();
};


