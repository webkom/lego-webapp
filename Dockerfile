FROM node:8 as builder

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn --ignore-scripts

ARG RELEASE

ENV NODE_ENV production
ENV RELEASE ${RELEASE}

RUN yarn build:all # includes styleguide

FROM getsentry/sentry-cli as sentry

RUN mkdir /app
WORKDIR /app/

ARG SENTRY_AUTH_KEY
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_URL
ARG RELEASE

ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_KEY}
ENV SENTRY_ORG ${SENTRY_ORG}
ENV SENTRY_PROJECT ${SENTRY_PROJECT}
ENV SENTRY_URL ${SENTRY_URL}

COPY --from=builder /app/dist dist
COPY --from=builder /app/dist-client dist-client

RUN sentry-cli releases new ${RELEASE}
RUN sentry-cli releases \
files ${RELEASE} upload-sourcemaps \
'./dist-client/'
RUN sentry-cli releases \
files ${RELEASE} upload-sourcemaps \
'./dist/' \
--url-prefix="/app/dist/"
RUN sentry-cli releases finalize ${RELEASE}

FROM node:8-alpine
MAINTAINER Abakus Webkom <webkom@abakus.no>
RUN mkdir /app
WORKDIR /app/

COPY --from=builder /app/dist dist
COPY --from=builder /app/dist-client dist-client
COPY --from=builder /app/package.json .
COPY --from=builder /app/styleguide styleguide
COPY --from=builder /app/node_modules node_modules

RUN yarn delete-sourcemaps

ENTRYPOINT ["node", "dist/server.js"]
