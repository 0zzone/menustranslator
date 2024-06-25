var express = require('express');
var router = express.Router();
require("dotenv").config()
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

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
                to: process.env.EMAIL_GOOGLE,
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

    } else if(typeMail === "updateSub") {

        const filePath = path.join(__dirname, 'updateSub.html');

        fs.readFile(filePath, 'utf8', (err, html) => {
            if (err) {
                return res.status(400).json({ error: "Une erreur est survenue" });
            }

            const filledHTML = html
                .replace('{{MAIL}}', data.email)
                .replace('{{PLAN}}', data.plan)

            const mailOptions = {
                from: process.env.EMAIL_GOOGLE,
                to: process.env.EMAIL_GOOGLE,
                subject: 'Mise à jour de l\'abonnement !',
                html: filledHTML
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({ error: "Une erreur est survenue" });
                }
                return res.status(200).json({ message: "Une demande a été envoyée pour vote changement d'abonnement !" });
            });
        });

    } else if(typeMail === "resilierSub") {

        const filePath = path.join(__dirname, 'resilierSub.html');

        fs.readFile(filePath, 'utf8', (err, html) => {
            if (err) {
                return res.status(400).json({ error: "Une erreur est survenue" });
            }

            const filledHTML = html
                .replace('{{MAIL}}', data.email)

            const mailOptions = {
                from: process.env.EMAIL_GOOGLE,
                to: process.env.EMAIL_GOOGLE,
                subject: 'Résiliation de l\'abonnement !',
                html: filledHTML
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({ error: "Une erreur est survenue" });
                }
                return res.status(200).json({ message: "Une demande a été envoyée pour vote changement d'abonnement !" });
            });
        });

    } else if(typeMail === "resetPassword") {

        const filePath = path.join(__dirname, 'resetPassword.html');

        const user = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        })

        const payload = {
            exp: Math.floor(Date.now() / 1000) + (5 * 60)
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        fs.readFile(filePath, 'utf8', (err, html) => {
            if (err) {
                return res.status(400).json({ error: "Une erreur est survenue" });
            }

            const filledHTML = html
                .replace('{{LINK}}', `${process.env.FRONTEND_DOMAIN}/forgot-password/${user.id_user}/${token}`)

            const mailOptions = {
                from: process.env.EMAIL_GOOGLE,
                to: data.email,
                subject: 'Changement de votre mot de passe !',
                html: filledHTML
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({ error: "Une erreur est survenue" });
                }
                return res.status(200).json({ message: "Une demande a été envoyée pour vote changement d'abonnement !" });
            });
        });

    }

})

module.exports = router;