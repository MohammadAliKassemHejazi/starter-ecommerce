# Local development image for the Next.js 14 (Pages Router) client.
# Not a production build — runs `npm run dev` with the source tree
# bind-mounted by docker-compose.yml for live reload.
#
# NOTE (see compose-setup task report): at the time this file was authored,
# client/ was missing its tracked source tree in the working directory
# (uncommitted deletion, unrelated to this task — flagged separately).
# This Dockerfile is written against client/package.json as recorded in
# git HEAD and will work once the client source is present/restored.
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev", "--", "-p", "3001"]
