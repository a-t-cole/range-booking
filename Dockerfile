FROM mhart/alpine-node:12.18.1
WORKDIR /usr/src/app
COPY ./api/package*.json ./
RUN npm i --only=production
COPY ./api ./
EXPOSE 80
CMD ["node", "index.js"]