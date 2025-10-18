FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# Ensure correct Prisma binaries are generated for Alpine
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
