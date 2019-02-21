FROM node:11

MAINTAINER Abakus Webkom <webkom@abakus.no>

WORKDIR /app
COPY . /app

ARG RELEASE
RUN yarn
ENV NODE_ENV production
ENV RELEASE ${RELEASE}

RUN yarn run build

ENTRYPOINT ["node", "dist/server.js"]
