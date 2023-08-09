FROM node:16-alpine as builder

WORKDIR /app/
COPY . /app

RUN apk add curl
RUN yarn

ENV NODE_ENV production

RUN yarn build

FROM getsentry/sentry-cli:1.26.1 as sentry

WORKDIR /app/

ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_URL
ARG RELEASE
ARG COMMIT_SHA

ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG ${SENTRY_ORG}
ENV SENTRY_PROJECT ${SENTRY_PROJECT}
ENV SENTRY_URL ${SENTRY_URL}
ENV RELEASE ${RELEASE}

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

FROM node:16-alpine

RUN apk add curl

WORKDIR /app/

ARG RELEASE
ENV RELEASE ${RELEASE}

COPY --from=builder /app/dist dist
COPY --from=builder /app/dist-client dist-client
COPY --from=builder /app/packages/lego-bricks/dist packages/lego-bricks/dist
COPY --from=builder /app/packages/lego-bricks/package.json packages/lego-bricks/package.json
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules node_modules

ENTRYPOINT ["node", "dist/server.js"]
