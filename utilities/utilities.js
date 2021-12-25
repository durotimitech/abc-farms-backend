const moment = require("moment");
const verifyCode = require("generate-sms-verification-code");

exports.getDate = () => {
  let m = moment();
  return m.toISOString();
};

exports.getVerificationCode = () => {
  return verifyCode(6, { type: "number" });
};
