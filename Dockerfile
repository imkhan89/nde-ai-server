FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN node buildProductIndex.js
RUN node buildSearchIndex.js

CMD ["node", "server.js"]
