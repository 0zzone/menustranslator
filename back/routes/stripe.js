var express = require('express');
var router = express.Router();
require("dotenv").config()
const { PrismaClient, Prisma } = require('@prisma/client');
const { parse } = require('dotenv');
const prisma = new PrismaClient()
const authenticateToken = require("./middleware")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', authenticateToken, async (req, res) => {
    const {price_id, id_user} = req.body
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_DOMAIN}/success/${id_user}/${price_id}`,
      cancel_url: `${process.env.FRONTEND_DOMAIN}/register`,
    });

  res.json({ id: session.id });
});

router.post('/update/:id_user/:price_id', authenticateToken, async (req, res) => {
  const {id_user, price_id} = req.params
  try {
    const user = await prisma.user.update({
      where: {
        id_user: parseInt(id_user)
      },
      data: {
        subscription: price_id
      }
    })

    return res.status(200).json({data: user})

  } catch(e) {
    return res.status(400).json({error: "Une erreur s'est produite"})
  }
})

module.exports = router;