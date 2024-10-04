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
      metadata: {
        user_id: req.user.id_user,
      },
      success_url: `${process.env.FRONTEND_DOMAIN}/success`,
      cancel_url: `${process.env.FRONTEND_DOMAIN}/register`,
    });

    res.json({ id: session.id });
  } else {
    res.status(404).json({data: "Page non trouvée !"})
  }
});

router.get("/:subscription_id", authenticateToken, async (req, res) => {

  const {subscription_id} = req.params

  try {
    const subscription = await stripe.subscriptions.retrieve(subscription_id)
    return res.status(200).json({subscription})
  } catch (error) {
    return res.status(400).json({error: "Une erreur est survenue"})
  }
});

router.put("/:subscription_id/:sub_item_id/:new_price_id", authenticateToken, async (req, res) => {

  const {sub_item_id, new_price_id, subscription_id} = req.params

  try {
    const updatedSubscription = await stripe.subscriptions.update(subscription_id, {
      items: [{
        id: sub_item_id,
        price: new_price_id,
      }],
      metadata: {
        user_id: req.user.id_user,
      },
    });

    return res.status(200).json({data: updatedSubscription})
  } catch (e) {
    console.log(e)
    return res.status(400).json({error: "Une erreur est survenue"})
  }
});

router.delete("/:subscription_id", authenticateToken, async (req, res) => {

  const {subscription_id} = req.params

  try {

    const subscription = await stripe.subscriptions.cancel(
      subscription_id
    );

    const updatedUser = await prisma.user.update({
      where: {
        id_user: req.user.id_user
      },
      data: {
        subscription: null,
        sub_item_id: null,
      }
    })

    return res.status(200).json({data: subscription})
  } catch (e) {
    console.log(e)
    return res.status(400).json({error: "Une erreur est survenue"})
  }
});

module.exports = router;