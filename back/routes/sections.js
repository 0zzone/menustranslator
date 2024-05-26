var express = require('express');
var router = express.Router();
require("dotenv").config()
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

router.post("/create", async (req, res) => {
    const {name, price=null, id_etablissement} = req.body

    try{
        const section = await prisma.section.create({
            data: {
                name,
                price: price ? parseFloat(price) : null,
                id_etablissement: parseInt(id_etablissement)
            }
        })

        return res.status(200).json({data: section})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})


module.exports = router;