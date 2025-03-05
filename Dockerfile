FROM node:20-alpine AS setup

WORKDIR /app/
COPY package.json yarn.lock ./
COPY lego-webapp/package.json lego-webapp/package.json
COPY packages packages

RUN apk add curl
RUN yarn install

FROM node:20-alpine AS builder

WORKDIR /app/
COPY . /app

COPY --from=setup /app/node_modules /app/node_modules

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
ENV SENTRY_RELEASE=${RELEASE}
ENV NODE_ENV=production

RUN yarn build

FROM node:20-alpine

WORKDIR /app/

ARG RELEASE
ENV RELEASE=${RELEASE}
ENV NODE_ENV=production

COPY --from=builder /app/package.json .
COPY --from=builder /app/lego-webapp/package.json ./lego-webapp/package.json
COPY --from=builder /app/lego-webapp/server ./lego-webapp/server
COPY --from=builder /app/lego-webapp/tsconfig.json ./lego-webapp/tsconfig.json
COPY --from=builder /app/lego-webapp/dist ./lego-webapp/dist
COPY --from=builder /app/node_modules node_modules

ENTRYPOINT ["node", "lego-webapp/dist/server/index.mjs"]
