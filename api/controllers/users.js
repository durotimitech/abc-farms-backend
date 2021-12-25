// Import dependencies
const { _response } = require("../../utilities/response");
const bcrypt = require("bcrypt");
const { getDate } = require("../../utilities/utilities");
const { getVerificationCode } = require("../../utilities/utilities");
const { sendEmail } = require("../../utilities/mailer");
const Queries = require("../database/queries");
const { generateAuthToken } = require("../../middleware/generateToken");
const { accessLevels } = require("../../utilities/constants");

//(POST) Add new user to database '/api/users'
exports.createUser = async (req, res, next) => {
  try {
    let data = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      verificationCode: getVerificationCode(),
      createdAt: getDate(),
      updatedAt: getDate(),
    };

    // Check if email is already in db
    const user = (
      await Queries.selectAllWith1Condition({
        table: "users",
        condition: { email: data.email },
      })
    )[0];

    if (user)
      return _response({
        statusCode: 409,
        res,
        result: "Email already exists",
      });

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return _response({ statusCode: 500, res, result: err });

      data.password = hash;

      Queries.insertOne({ data, table: "users" });

      sendEmail({
        emails: [data.email],
        subject: "Please confirm your email!",
        emailType: "confrim email",
        content: { verificationCode: data.verificationCode },
      });

      _response({ statusCode: 201, res, result: "success" });
    });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (POST) login user to '/api/users/login'
exports.loginUser = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    const user = (
      await Queries.selectAllWith1Condition({
        table: "users",
        condition: { email: data.email },
      })
    )[0];

    if (!user)
      return _response({
        statusCode: 400,
        res,
        result: "Email or Password is incorrect",
      });

    // Compare received password with saved hash
    bcrypt.compare(data.password, user.password, (err, result) => {
      if (err)
        return _response({
          statusCode: 400,
          res,
          result: "Email or password is incorrect",
        });

      // GET JSON WEB TOKEN
      if (result) {
        const token = generateAuthToken(user);
        // Get access levels
        let accessLevel;

        switch (user.accessLevel) {
          case accessLevels.USER:
            accessLevel = [1];
            break;
          case accessLevels.SALESMAN:
            accessLevel = [1, 2];
            break;
          case accessLevels.ADMIN:
            accessLevel = [1, 2, 3];
            break;
        }

        return _response({
          statusCode: 200,
          res,
          result: {
            message: "Log in successful",
            token: token,
            accessLevel,
            isEmailVerified: user.isEmailVerified,
            email: user.email,
            firstName: user.firstName,
            userId: user.userId,
            lastName: user.lastName,
            phone: user.phone,
          },
        });
      } else {
        return _response({
          statusCode: 400,
          res,
          result: "Email or password is incorrect",
        });
      }
    });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (PATCH) verify user email
exports.verifyEmail = async (req, res, next) => {
  try {
    let data = {
      email: req.body.email,
      verificationCode: req.body.verificationCode,
      isEmailVerified: req.body.isEmailVerified,
      updatedAt: getDate(),
    };

    const user = (
      await Queries.selectAllWith1Condition({
        table: "users",
        condition: { email: data.email },
      })
    )[0];

    if (!user)
      return _response({
        statusCode: 401,
        res,
        result: "Email not found!",
      });

    if (user.verificationCode === data.verificationCode) {
      await Queries.updateOne({
        table: "users",
        data,
        condition: { email: data.email },
      });
      _response({ statusCode: 201, res, result: "success" });
    } else {
      _response({
        statusCode: 400,
        res,
        result: "The verification code is not valid!",
      });
    }
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (PATCH) resend verify email
exports.resendVerifyEmail = (req, res, next) => {
  try {
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    updateOps.verificationCode = getVerificationCode();

    User.findOne({ email: updateOps.email })
      .exec()
      .then((user) => {
        if (!user) {
          return _response({
            statusCode: 401,
            res,
            result: "Email not found!",
          });
        }

        User.updateOne({ email: updateOps.email }, { $set: updateOps })
          .exec()
          .then((response) => {
            sendEmail({
              emails: [updateOps.email],
              subject: "Please confirm your email!",
              emailType: "confrim email",
              content: { verificationCode: updateOps.verificationCode },
            });
            _response({ statusCode: 201, res, result: "success" });
          })
          .catch((e) => _response({ statusCode: 500, res, result: e }));
      });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (PATCH) reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
      password: "",
      updatedAt: getDate(),
    };
    const user = (
      await Queries.selectAllWith1Condition({
        table: "users",
        condition: { email: data.email },
      })
    )[0];

    if (!user)
      return _response({
        statusCode: 401,
        res,
        result: "Email not found!",
      });

    const newPassword = getVerificationCode().toString();

    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) return _response({ statusCode: 500, res, result: err });

      data.password = hash;

      Queries.updateOne({
        table: "users",
        data,
        condition: { email: data.email },
      });

      sendEmail({
        emails: [data.email],
        subject: "Password Reset!",
        emailType: "reset password",
        content: { password: newPassword },
      });
      _response({ statusCode: 201, res, result: "success" });
    });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (PATCH) change password
exports.changePassword = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      updatedAt: getDate(),
    };
    const user = (
      await Queries.selectAllWith1Condition({
        table: "users",
        condition: { email: req.user.email },
      })
    )[0];

    if (!user)
      return _response({
        statusCode: 401,
        res,
        result: "Email not found!",
      });

    bcrypt.compare(data.oldPassword, user.password, (err, result) => {
      if (err)
        return _response({
          statusCode: 400,
          res,
          result: "Email or Password Incorrect!",
        });

      if (result) {
        bcrypt.hash(data.password, 10, (err, hash) => {
          if (err) return _response({ statusCode: 500, res, result: err });

          data.password = hash;
          delete data.oldPassword;
          delete data.confirmPassword;

          Queries.updateOne({
            table: "users",
            condition: { email: req.user.email },
            data,
          });
          console.log("dataaa", data);

          sendEmail({
            emails: [req.user.email],
            subject: "Password Changed!",
            emailType: "change password",
            content: {},
          });

          return _response({ statusCode: 200, res, result: "success" });
        });
      } else {
        return _response({
          statusCode: 401,
          res,
          result: "Email or Password Incorrect!",
        });
      }
    });
  } catch (e) {
    return _response({ statusCode: 500, res, result: e });
  }
};

// (GET) retrieve all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await Queries.selectAllAndOrder({
      table: "users",
      orderBy: "createdAt",
      direction: "DESC",
    });

    const result = {
      count: users.length,
    };

    _response({ statusCode: 200, res, result });
  } catch (e) {
    _response({ statusCode: 500, res, result: e });
  }
};

// (GET) retrieve all administrators
exports.getAdmins = async (req, res, next) => {
  try {
    const users = await Queries.selectColumnsWith1Operator({
      table: "users",
      condition: "accessLevel >1",
      columns: ["userId", "email", "firstName", "lastName", "accessLevel"],
    });

    return _response({ statusCode: 200, res, result: users });
  } catch (e) {
    return _response({ statusCode: 500, res, result: e });
  }
};

// (PATCH) Admins updates user
exports.adminUpdateUser = async (req, res, next) => {
  try {
    const data = {
      accessLevel: req.body.accessLevel,
      updatedAt: getDate(),
    };

    const user = (
      await Queries.selectAllWith1Condition({
        table: "users",
        condition: { email: req.body.email },
      })
    )[0];

    if (!user)
      return _response({
        statusCode: 400,
        res,
        result: "Email not found!",
      });

    await Queries.updateOne({
      table: "users",
      data,
      condition: { email: req.body.email },
    });

    return _response({ statusCode: 200, res, result: "success" });
  } catch (e) {
    return _response({ statusCode: 500, res, result: e });
  }
};

/*
CREATE TABLE users (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `isEmailVerified` TINYINT(1) NOT NULL,
  `accessLevel` INT NOT NULL DEFAULT 1,
  `verificationCode` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`userId`));
*/
