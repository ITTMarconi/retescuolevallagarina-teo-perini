FROM nginx:alpine3.18
RUN apk add --no-cache alpine-conf && \
    setup-timezone -z Europe/Rome

COPY ./dist /usr/share/nginx/html

RUN ls /usr/share/nginx/html

EXPOSE 80
