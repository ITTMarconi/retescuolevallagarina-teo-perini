FROM node:22-alpine3.18 AS build


# Start server
VOLUME /MaDe/Data
WORKDIR /MaDe/Server
COPY ../Server .

RUN [ "node", "index.js", "&" ]


# Build app
WORKDIR /MaDe/App
COPY . ./App

RUN [ "npm", "install" ]
RUN [ "npm", "run", "build" ]

#####

FROM nginx:alpine3.18 AS run

COPY --from=build /MaDe/App/dist /usr/share/nginx/html

EXPOSE 80