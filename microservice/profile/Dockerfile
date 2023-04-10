FROM node:latest

WORKDIR /app/profile

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]