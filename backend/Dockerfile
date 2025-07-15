FROM node:22

WORKDIR /app

COPY backend/package.json ./

COPY yarn.lock ./

RUN yarn install

COPY backend/ ./

EXPOSE 3000

CMD ["yarn", "dev"]
