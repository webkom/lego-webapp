FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN apk add curl
RUN yarn install

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json yarn.lock /app/
WORKDIR /app
RUN apk add curl
RUN yarn install --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN yarn build

FROM getsentry/sentry-cli:1.26.1 AS sentry

WORKDIR /app

ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_URL
ARG RELEASE
ARG COMMIT_SHA

ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}
ENV SENTRY_URL=${SENTRY_URL}
ENV RELEASE=${RELEASE}

COPY --from=builder /app/dist dist
COPY --from=builder /app/dist-client dist-client

RUN sentry-cli releases new ${RELEASE}
RUN sentry-cli releases set-commits ${RELEASE} --commit "webkom/lego-webapp@${COMMIT_SHA}"
RUN sentry-cli releases \
  files ${RELEASE} upload-sourcemaps \
  --rewrite --url-prefix="/app/dist/" \
  './dist/'
RUN sentry-cli releases finalize ${RELEASE}
RUN sentry-cli releases deploys ${RELEASE} new -e "staging"
RUN sentry-cli releases deploys ${RELEASE} new -e "production"

FROM node:20-alpine

ARG RELEASE
ENV RELEASE=${RELEASE}

COPY ./package.json yarn.lock /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["yarn", "start"]