FROM node:22-alpine 

WORKDIR /my-app 

COPY package*.json ./ 

RUN npm ci 

COPY . .   

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]