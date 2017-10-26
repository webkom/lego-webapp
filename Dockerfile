FROM node:8

MAINTAINER Abakus Webkom <webkom@abakus.no>

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn

ARG RELEASE
ARG SENTRY_AUTH_KEY

ENV NODE_ENV production
ENV RELEASE ${RELEASE}

RUN yarn run styleguide:build
RUN yarn run build
RUN SENTRY_AUTH_KEY=${SENTRY_AUTH_KEY} node scripts/release.js --delete

ENTRYPOINT ["node", "dist/server.js"]
