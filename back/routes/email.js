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



router.post("/send", async (req, res) => {

    const {to=null, data=null, typeMail} = req.body

    if(typeMail === "welcome"){
        const filePath = path.join(__dirname, 'welcome.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(400).json({error: "Une erreur est survenue"})
            }
    
            const mailOptions = {
                from: process.env.EMAIL_GOOGLE,
                to,
                subject: 'Bievenue sur Menufy !',
                html: data
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({error: "Une erreur est survenue"})
                }
                return res.status(200)
            });
    
        });
    } else if(typeMail === "demo") {

        const filePath = path.join(__dirname, 'demo.html');

        fs.readFile(filePath, 'utf8', (err, html) => {
            if (err) {
                return res.status(400).json({ error: "Une erreur est survenue" });
            }

            const filledHTML = html.replace('{{MAIL}}', data.email);

            const mailOptions = {
                from: process.env.EMAIL_GOOGLE,
                to: "dev.matteobonnett@gmail.com",
                subject: 'Demande de démo !',
                html: filledHTML
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({ error: "Une erreur est survenue" });
                }
                return res.status(200).json({ message: "Un email a été envoyé avec succès !" });
            });
        });

    }

})

module.exports = router;