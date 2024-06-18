var express = require('express');
var router = express.Router();
require("dotenv").config()
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_GOOGLE,
        pass: process.env.EMAIL_PASS
    }
});

const filePath = path.join(__dirname, 'welcome.html');


router.post("/send", async (req, res) => {

    const {to} = req.body

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_GOOGLE,
            to,
            subject: 'Bievenue sur Menufy !',
            html: data
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });

    });

})

module.exports = router;