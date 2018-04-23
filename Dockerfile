FROM mhart/alpine-node

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache git && \
    npm install && \
    apk del git

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]

