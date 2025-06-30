FROM node:20-slim

WORKDIR /app
COPY . .
RUN yarn install
CMD ["node", "src/server.js"]