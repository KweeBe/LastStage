FROM node:latest

WORKDIR /app/user

COPY package*.json ./

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

COPY . .

CMD ["npm", "run", "start:dev"]