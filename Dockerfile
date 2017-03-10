FROM node:7-alpine

MAINTAINER Abakus Webkom <webkom@abakus.no>

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN set -e \
  && yarn

ENV NODE_ENV production

RUN set -e \
  && yarn run build

ENTRYPOINT ["node", "dist/server.js"]
