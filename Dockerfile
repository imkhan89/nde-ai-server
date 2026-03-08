FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install axios dotenv

COPY . .

EXPOSE 3000

CMD ["node","server.js"]
