FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY src ./src
EXPOSE 8000
CMD ["node", "src/server.js"]
