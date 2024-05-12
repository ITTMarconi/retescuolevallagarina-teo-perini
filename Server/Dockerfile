FROM node:22-alpine3.18

WORKDIR /MaDe/Data
COPY ../Data .

WORKDIR /MaDe/Server
COPY . .

RUN npm install

EXPOSE 25565

HEALTHCHECK --interval=5m --timeout=5s \
    CMD curl -f http://localhost/healthcheck || exit 1

CMD [ "node", "index.js" ]