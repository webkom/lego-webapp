FROM node:20-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app/
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lego-webapp/package.json lego-webapp/package.json
COPY packages packages

RUN corepack enable
RUN apk add curl # For Mazemap installation
RUN pnpm install --frozen-lockfile

COPY . /app

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

RUN pnpm build

FROM node:20-alpine

WORKDIR /app/

RUN apk add curl # For healthcheck

ARG RELEASE
ENV RELEASE=${RELEASE}
ENV NODE_ENV=production

COPY --from=builder /app/package.json .
COPY --from=builder /app/lego-webapp/package.json ./lego-webapp/package.json
COPY --from=builder /app/lego-webapp/tsconfig.json ./lego-webapp/tsconfig.json
COPY --from=builder /app/lego-webapp/dist ./lego-webapp/dist
COPY --from=builder /app/lego-webapp/node_modules ./lego-webapp/node_modules
COPY --from=builder /app/node_modules node_modules

ENTRYPOINT ["node", "lego-webapp/dist/server/index.mjs"]
