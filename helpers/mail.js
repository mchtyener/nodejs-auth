const nodemailer = require("nodemailer");
const env = require("dotenv")
env.config()


let transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
        from: "No Reply <process.env.MAIL>"
    },
});

module.exports = transporter;
