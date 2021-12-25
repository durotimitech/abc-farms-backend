const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "Please log in!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;

    next();
  } catch (e) {
    res.status(401).json({ error: e, message: "Please log in!" });
  }
};
