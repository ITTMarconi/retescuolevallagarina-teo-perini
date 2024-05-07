# MaDe Progetto Scuole

## Preview

> **BROKEN STUFF**
>
> - App dockerfile doesn't work because it relys upon Server to be up to build astro stuff

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

## Design concepts and notes

![Desktop landing page](/Design/images/landing_desktop.png)

![Mobile overview](/Design/images/mobile.png)
