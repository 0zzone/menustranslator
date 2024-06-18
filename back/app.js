var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');

var userRouter = require('./routes/users');
var etablissementRouter = require('./routes/etablissements')
var sectionRouter = require("./routes/sections")
var lineRouter = require("./routes/lines")
var stripeRouter = require('./routes/stripe')
var emailRouter = require("./routes/email")

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

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
