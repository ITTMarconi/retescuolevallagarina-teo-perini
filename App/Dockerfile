FROM node:22-alpine3.18 AS build

WORKDIR /MaDe
COPY ../Data ./Data

WORKDIR /MaDe/Server
COPY ../Server ./Server
RUN npm install

WORKDIR /MaDe/App
COPY . ./App
RUN npm install

RUN cd ./Server && node index.js & && \
    cd ../App && npm run build

#####

FROM nginx:alpine3.18 AS run

COPY ../nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /MaDe/App/dist /usr/share/nginx/html

EXPOSE 8080