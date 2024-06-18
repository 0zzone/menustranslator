#!/bin/sh

sleep 10

npx prisma generate
npx prisma db push
npx prisma db seed

node app.js