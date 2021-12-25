"use strict";
// const nodemailer = require("nodemailer");
// const smtpTransport = require("nodemailer-smtp-transport");
const mailgun = require("mailgun-js");

const DOMAIN = process.env.MGDOMAIN;
const mg = mailgun({
  apiKey: process.env.MGAPIKEY,
  domain: DOMAIN,
});

module.exports = {
  sendEmail: ({ emails, subject, emailType, content }) => {
    console.log("sendign...");

    const data = {
      from: process.env.EMAIL,
      to: emails,
      subject: subject,
      html: emailTemplates(emailType, content),
    };

    mg.messages().send(data, function (error, body) {
      if (error) console.error(error);

      console.log(body);
    });
    // Nodemailer
    // const transporter = nodemailer.createTransport(

    //   {
    //     host: "mail.agbizconcepts.com.ng",
    //     service: "smtp",
    //     port: 465,
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //       user: process.env.EMAIL,
    //       pass: process.env.PASS,
    //     },
    //     tls: {
    //       ciphers: "SSLv3",
    //       rejectUnauthorized: false,
    //     },
    //   }
    // );

    // const mailOptions = {
    //   from: process.env.USER,
    //   to: emails,
    //   subject: subject,
    //   html: emailTemplates(emailType, content),
    // };

    // transporter.sendMail(mailOptions, function (err, info) {
    //   if (err) console.log("Mail Error: ", err);
    //   else {
    //     console.log("mail sent");
    //   }
    // });
  },
};

const emailTemplates = (emailType, content) => {
  switch (emailType) {
    case "confrim email":
      return verifyEmailTemplate(content);
    case "reset password":
      return resetPasswordTemplate(content);
    case "change password":
      return changePasswordTemplate(content);
    case "order create":
      return createOrderTemplate(content);
    default:
      return "<h1>An error occured!</h1>";
  }
};

const verifyEmailTemplate = (content) => {
  return `
  <h1>Hello There!</h1> 
  <br /> 
  Here is your verification code <b> ${content.verificationCode}</b>.
  `;
};

const resetPasswordTemplate = (content) => {
  return `
  <h1>Hello There!</h1> 
  <br /> 
  Here is your new password <b> ${content.password}</b>.
  `;
};

const changePasswordTemplate = (content) => {
  return `
  <h1>Hello There!</h1> 
  <br /> 
  Your password was just changed!.
  `;
};

const createOrderTemplate = (content) => {
  return `
  <h1>Hello There!</h1> 
  <br /> 
  Your Order has been created successfully!.
  `;
};
