FROM node:14-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build
ENTRYPOINT ["node", "dist/app.js"]
