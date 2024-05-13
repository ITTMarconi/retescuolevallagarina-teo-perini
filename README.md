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

Requirements:

- node (reccomended v19.5.0)
- docker (optional)
- docker-compose (optional)

Notes:

- Default Server ip and port are `localhost:25565`
- Default App ip and port are `YOUR_LOCAL_IP:1234`
- If you want to set a custom server address and port \
  you just need to edit `/Data/constants.ts` AND `/Data/constants.js` \
  (Yes, I know, annoying, but is JS fault)
- Remember to open the firewall port for `TCP:25565`!

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

### Building image and running container (on local network)

```bash
# Build and start server
cd ./Server
./server_run.sh

# Test if it's up and running
curl http://<SERVER_IP>:<SERVER_PORT>/Data/Istituti/Arcivescovile/data.json

# Build app
cd ../App
npm install
npm run build
./app_run.sh

# Test if app it's running
curl http://<SERVER_IP>/
```

### Using docker compose

```bash
# Set ip and port!!!
vi Data/constants.js
vi Data/constants.ts
#####

# Build and start server
cd Server
./server_run.sh

# DO NOT STOP SERVER

# check if the server is on
curl http://<SERVER_IP>:<SERVER_PORT>/Data/Istituti/Arcivescovile/data.json

cd ..

# Build app
cd App
npm install
npm run build

cd ..


# Kill server
docker stop made-server_instance


docker-compose up

# Test if server is up and running
curl http://<SERVER_IP>:<SERVER_PORT>/Data/Istituti/Arcivescovile/data.json

# Test if app it's running
curl http://<SERVER_IP>/
```

### Troubleshooting

#### App build failed fetch failed

Make sure you have the server up and running before starting the application

#### Server address not available

You probably forgot another instance running, check and retry

> You can use `sudo lsof -i :25565` to find processes using the port

#### Images don't render when connected to App in LAN

The server manages media distribution, check your firewall if you have the required port open (default TCP:25565)

## Design concepts

Desktop landing page
![Desktop landing page](/Design/prototype/desktop/landing_desktop.png)

Mobile overview
![Mobile overview](/Design/prototype/mobile/mobile.png)
