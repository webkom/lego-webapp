FROM node:8

MAINTAINER Abakus Webkom <webkom@abakus.no>

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn

ARG RELEASE

ENV NODE_ENV production
ENV RELEASE ${RELEASE}

RUN yarn run styleguide:build
RUN yarn run build

ENTRYPOINT ["node", "dist/server.js"]
