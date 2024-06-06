#!/bin/sh

sleep 10

npx prisma generate
npx prisma db push

node app.js