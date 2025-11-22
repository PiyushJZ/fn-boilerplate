FROM node:lts-krypton AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:lts-krypton AS deps

WORKDIR /app

COPY --from=build /app/package.json ./
RUN npm install --omit=dev

FROM chainguard/node:latest

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=deps /app/node_modules ./

EXPOSE ${PORT}

CMD ["node", "dist/server.js"]