> ⚠️ BROKEN STUFF
> App dockerfile doesn't work (yet) because it relys upon Server to be up to build astro stuff

# MaDe Progetto Scuole

Sito web realizzato in collaborazione con il Liceo Artistico Depero,
lo scopo del sito è di centralizzare le informazioni sulle scuole superiori
disponibili nel territorio di Rovereto in un unico luogo

## Preview

Istituti page
![Istituti page](/Design/result/desktop/istituti_desktop.png)

Mobile overview
![Mobile overview](/Design/result/desktop/opendays_desktop.png)

## Missing / TODO

- [ ] Astro build workaround
- [ ] Full Docker support

- [ ] Finish README
  - [ ] Add preview screenshots
  - [ ] Add guide to add new school
  - [ ] Add instruction to run project

- [ ] Make video

## Running project

Notes:

- Default Server ip and port are `localhost:25565`
- Default App ip and port are `YOUR_LOCAL_IP:1234`
- If you want to set a custom server address and port \
  you just need to edit `/Data/constants.ts` AND `/Data/constants.js` \
  (Yes, I know, annoying, but is JS fault)

### Running dev

```bash
# Start server
cd ./Server
npm install
node index.js &

cd ..

# Start app
cd ./App 
npm install
npm run dev -- --host
```

### Running production (by hand)

```bash
# Set local ip !!!
vim Data/constants.js
vim Data/constants.ts
### 

# Start server
cd ./Server
npm install
node index.js &

cd ..

# Build app
cd ./App 
npm install
npm run build

# Start app
docker run -d \
-v /$(pwd)/dist:/usr/share/nginx/html \
--name webapp \
-p 80:80 \
nginx
```

### Building image and running container

```bash
# Build and start server
cd ./Server
./run.sh

cd ..

# Build and start app
cd ./App 
./run.sh
```

## Design concepts

Desktop landing page
![Desktop landing page](/Design/prototype/desktop/landing_desktop.png)

Mobile overview
![Mobile overview](/Design/prototype/mobile/mobile.png)
