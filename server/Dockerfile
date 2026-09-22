# Local development image for the Express/Sequelize API.
# Not a production build — runs `npm run dev` (nodemon + ts-node) with the
# source tree bind-mounted by docker-compose.yml for live reload.
FROM node:18-alpine

WORKDIR /app

# Install deps first so this layer is cached across source-only changes.
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
