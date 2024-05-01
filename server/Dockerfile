FROM node:20-alpine
WORKDIR /usr/src/app
RUN mkdir certs
COPY package.json ./
RUN npm i pnpm -g
RUN pnpm install
EXPOSE 3003
COPY . .
CMD ["pnpm", "start"]