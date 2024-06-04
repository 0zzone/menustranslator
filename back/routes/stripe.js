var express = require('express');
var router = express.Router();
require("dotenv").config()
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
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
      success_url: `http://localhost:5173/success/${id_user}/${price_id}`,
      cancel_url: 'http://localhost:5173/register',
    });

    res.json({ id: session.id });
  });

module.exports = router;