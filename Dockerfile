FROM mhart/alpine-node:8

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies

# RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]

