FROM node:7-alpine

MAINTAINER Abakus Webkom <webkom@abakus.no>

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn

ARG RELEASE
ARG SENTRY_AUTH_KEY

ENV NODE_ENV production
ENV RELEASE ${RELEASE}

RUN yarn run build

RUN apk add --update curl && rm -rf /var/cache/apk/*
RUN SENTRY_AUTH_KEY=${SENTRY_AUTH_KEY} node scripts/release.js --delete

ENTRYPOINT ["node", "dist/server.js"]
