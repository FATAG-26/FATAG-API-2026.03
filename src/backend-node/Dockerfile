FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY data ./data
EXPOSE 8000
CMD ["node", "src/server.js"]
