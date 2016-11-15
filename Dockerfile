FROM nginx:stable-alpine

MAINTAINER Abakus Webkom <webkom@abakus.no>

WORKDIR /usr/share/nginx/html

COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/ /usr/share/nginx/html
