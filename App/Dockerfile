FROM node:22-alpine3.18

WORKDIR /MaDe

WORKDIR ./App
COPY . .

RUN npm install
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# CMD [ "node", "./dist/server/entry.mjs" ]
CMD [ "npm", "run", "dev", "--", "--host" ]