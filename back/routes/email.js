var express = require('express');
var router = express.Router();
require("dotenv").config()
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dev.matteobonnett@gmail.com',
        pass: 'escrimem@tt91'
    }
});

router.post("/send", async (req, res) => {
    const {to} = req.body
    const mailOptions = {
        from: 'dev.matteobonnett@gmail.com', // sender address
        to, // list of receivers
        subject: 'Bievenue sur Menufy', // Subject line
        html: '<b>Hello world</b>' // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
})

module.exports = router;