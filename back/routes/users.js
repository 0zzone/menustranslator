var express = require('express');
var router = express.Router();
require("dotenv").config()
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

router.post('/create', async (req, res, next) => {
  const {email, firstName, lastName, password, subscription=0} = req.body

    try {
        const user_already = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if(user_already != null){
            return res.status(400).json({error: "L'utilisateur existe déjà !"})
        }

        const user = await prisma.user.create({
            data: {
                email, firstName, lastName, password, subscription
            }
        })

        return res.status(200).json({data: user})

    } catch(e){
        return res.status(400).json({error: "Une erreur s'est produite"})
    }

});

router.get('/get/:email', async (req, res) => {
    const {email} = req.params

    try{
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                etablissements: true
            }
        })


        return res.status(200).json({data: user})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

module.exports = router;
