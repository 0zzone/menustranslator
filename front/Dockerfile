# Stage 1: Build the React application
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

ARG VITE_APP_URL
ENV VITE_APP_URL=${VITE_APP_URL}

ARG VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}

ARG VITE_SILVER_PRICE
ENV VITE_SILVER_PRICE=${VITE_SILVER_PRICE}

ARG VITE_GOLD_PRICE
ENV VITE_GOLD_PRICE=${VITE_GOLD_PRICE}

RUN npm run build

# Stage 2: Serve the app using a lightweight node server like serve
FROM node:14
WORKDIR /app
COPY --from=build /app/dist /app
RUN npm install -g serve
CMD ["serve", "-s", "/app", "-l", "3000"]
EXPOSE 3000