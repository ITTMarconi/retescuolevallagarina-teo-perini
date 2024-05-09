# MaDe Progetto Scuole

> BROKEN STUFF
> App dockerfile doesn't work (yet) because it relys upon Server to be up to build astro stuff

Sito web realizzato in collaborazione con il Liceo Artistico Depero,
lo scopo del sito è di centralizzare le informazioni sulle scuole superiori
disponibili nel territorio di Rovereto in un unico luogo

## Preview

TODO

## Missing / TODO

- [ ] `[id].astro`
  - [ ] Change desktop UI
  - [ ] Add mobile support

- [ ] `openday.astro`
  - [ ] Fix desktop UI
  - [ ] Add mobile support

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
  (Yes, I know, annoying)

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
![Desktop landing page](/Design/images/landing_desktop.png)

Mobile overview
![Mobile overview](/Design/images/mobile.png)
