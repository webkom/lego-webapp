FROM node:7-alpine

MAINTAINER Abakus Webkom <webkom@abakus.no>

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn

ARG API_URL
ARG WS_URL
ARG BASE_URL
ARG CAPTCHA_KEY

ENV NODE_ENV production
ENV API_URL ${API_URL}
ENV WS_URL ${WS_URL}
ENV BASE_URL ${BASE_URL}
ENV CAPTCHA_KEY ${CAPTCHA_KEY}

RUN yarn run build

ENTRYPOINT ["node", "dist/server.js"]
