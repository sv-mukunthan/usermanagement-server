const nodemailer = require('nodemailer');

const sendMail = async (to, subject, text, html) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 25,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  let email = transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  })
  return email;
}

module.exports = sendMail;