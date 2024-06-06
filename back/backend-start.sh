#!/bin/sh

sleep 10

npm run prisma generate
npm run prisma db push

node app.js