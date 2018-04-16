FROM mhart/alpine-node:8

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]

