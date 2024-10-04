var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const { PrismaClient, Prisma } = require('@prisma/client');
const { parse } = require('dotenv');
const prisma = new PrismaClient()

var userRouter = require('./routes/users');
var etablissementRouter = require('./routes/etablissements')
var sectionRouter = require("./routes/sections")
var lineRouter = require("./routes/lines")
var stripeRouter = require('./routes/stripe')
var emailRouter = require("./routes/email")

var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

/* ********* Only the webhook endpoint ******** */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Use the raw body to construct the event
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Retrieve subscription details
    const subscriptionId = session.subscription;
    stripe.subscriptions.retrieve(subscriptionId)
      .then(async subscription => {
  
      const user = await prisma.user.update({
        where: {
          id_user: parseInt(session.metadata.user_id)
        },
        data: {
          subscription: subscription.id,
          sub_item_id: subscription.items.data[0].id,
        }
      })

      })
      .catch(err => console.error('Failed to retrieve subscription:', err));
  } else if(event.type === "customer.subscription.updated"){

    const subscription = event.data.object

    const user = prisma.user.findUnique({
      where: {
        id_user: parseInt(subscription.metadata.user_id)
      }
    })

    if(user){
      const updatedUser = prisma.user.update({
        where: {
          id_user: parseInt(subscription.metadata.user_id)
        },
        data: {
          subscription: subscription.id,
          sub_item_id: subscription.items.data[0].id,
        }
      })
    }
  }
  
  res.json({ received: true });
});
/* ************************** */

app.use(express.json());

app.use('/users', userRouter);
app.use("/etablissements", etablissementRouter)
app.use("/sections", sectionRouter)
app.use("/lines", lineRouter)
app.use("/stripe", stripeRouter)
app.use("/email", emailRouter)

port = 3333
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
