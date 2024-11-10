FROM node:22-alpine3.18

RUN apk add --no-cache alpine-conf && \
    setup-timezone -z Europe/Rome

WORKDIR /MaDe/Server
COPY . .

RUN npm install

VOLUME /MaDe/Data
EXPOSE 25565

# HEALTHCHECK --interval=5m --timeout=5s \
#     CMD curl -f http://localhost/healthcheck || exit 1

CMD [ "node", "index.js" ]
