var express = require('express');
var router = express.Router();
require("dotenv").config()
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()
const authenticateToken = require("./middleware")

router.post("/create", authenticateToken, async (req, res) => {
    const {name, owner_id} = req.body

    try{

        const user = await prisma.user.findUnique({
            where: {
                email: req.user.email
            },
            include: {
                etablissements: true
            }
        })

        if(!user.subscription){
            return res.status(400).json({error: "Vous devez souscrire à un abonnement"})
        }

        if(user.subscription === process.env.SILVER_PRICE){
            if(user.etablissements.length > 0){
                return res.status(400).json({error: "Votre abonnement ne vous permet pas d'avoir plusieurs établissements"})
            }
        }

        const etablissement = await prisma.etablissement.create({
            data: {
                name,
                owner_id
            }
        })

        return res.status(200).json({data: etablissement})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.get("/:id", async (req, res) => {
    const {id} = req.params
    try{
        const data = await prisma.etablissement.findUnique({
            where: {
              id_etablissement: parseInt(id)
            },
            include: {
                sections: {
                    include: {
                        lines: {
                            orderBy: {
                                rank: "asc" 
                            }
                        }
                    },
                    orderBy: {
                       rank: "asc" 
                    }
                }
            },
        })

        if(data !== null)
            return res.status(200).json({data})
        return res.status(404).json({error: "Aucun établissement n'a été trouvé !"})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.get("/admin/:id", authenticateToken, async (req, res) => {

    const {id} = req.params

    try{

        const user = await prisma.user.findUnique({
            where: {
                id_user: parseInt(req.user.id_user)
            },
            include: {
                etablissements: true
            }
        })

        if(!user.etablissements.map(eta => eta.id_etablissement).includes(parseInt(id))) {
            return res.status(400).json({error: "Établissement introuvable !"})
        }

        const data = await prisma.etablissement.findUnique({
            where: {
              id_etablissement: parseInt(id)
            },
            include: {
                sections: {
                    include: {
                        lines: {
                            orderBy: {
                                rank: "asc" 
                            }
                        }
                    },
                    orderBy: {
                       rank: "asc" 
                    }
                }
            },
        })

        if(data !== null)
            return res.status(200).json({data})
        return res.status(404).json({error: "Aucun établissement n'a été trouvé !"})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})


router.post("/update/:id_etablissement", authenticateToken, async (req, res) => {
    const {id_etablissement} = req.params
    // const {theme=null, logo=null} = req.body
    try{

        const etablissement = await prisma.etablissement.update({
            where: {
                id_etablissement: parseInt(id_etablissement)
            },
            data: req.body
        })

        return res.status(200).json({data: etablissement})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.post("/search", authenticateToken, async (req, res) => {
    const {name} = req.body
    try {
        const results = await prisma.etablissement.findMany({
            where: {
                name : {
                    contains: name,
                    mode: 'insensitive'
                }
            },
            include: {
                owner: true
            }
        })

        return res.status(200).json({data: results})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

module.exports = router;