FROM node:8 as builder

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn --ignore-scripts

ARG RELEASE

ENV NODE_ENV production
ENV RELEASE ${RELEASE}

RUN yarn build:all # includes styleguide

FROM node:8
MAINTAINER Abakus Webkom <webkom@abakus.no>
RUN mkdir /app
WORKDIR /app/

ARG RELEASE
ENV RELEASE ${RELEASE}

COPY --from=builder /app/dist dist
COPY --from=builder /app/dist-client dist-client
COPY --from=builder /app/package.json .
COPY --from=builder /app/styleguide styleguide
COPY --from=builder /app/node_modules node_modules

ENTRYPOINT ["node", "dist/server.js"]
