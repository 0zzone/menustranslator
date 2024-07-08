var express = require('express');
var router = express.Router();
require("dotenv").config()
const { PrismaClient, Prisma } = require('@prisma/client');
const { parse } = require('dotenv');
const prisma = new PrismaClient()
const authenticateToken = require("./middleware")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  const {price_id=null} = req.body
  if(price_id === process.env.GOLD_PRICE || price_id === process.env.SILVER_PRICE){
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_DOMAIN}/success/${price_id}`,
      cancel_url: `${process.env.FRONTEND_DOMAIN}/register`,
    });
    res.json({ id: session.id });
  } else {
    res.status(404).json({data: "Page non trouvée !"})
  }
});

router.post('/update/:price_id', authenticateToken, async (req, res) => {
  const {price_id} = req.params

  try {

    const {data} = await stripe.customers.list();
    const is_in = data.filter(customer => customer.email === req.user.email).length > 0


    if(is_in){
      const user = await prisma.user.update({
        where: {
          id_user: req.user.id_user
        },
        data: {
          subscription: price_id
        }
      })
      return res.status(200).json({data: user})
    } else {
      return res.status(400).json({message: "Une erreur s'est produite"})
    }

  } catch(e) {
    return res.status(400).json({error: "Une erreur s'est produite"})
  }
})

module.exports = router;