const jwt = require("jsonwebtoken");

exports.generateAuthToken = (data) => {
  const user = {
    email: data.email,
    userId: data.userId,
    accessLevel: data.accessLevel,
    isEmailVerified: data.isEmailVerified,
    phone: data.phone,
  };
  const token = jwt.sign(
    {
      ...user,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

