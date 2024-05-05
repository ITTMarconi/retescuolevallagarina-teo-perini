# MaDe Progetto Scuole

> **BROKEN STUFF**
>
> - App dockerfile doesn't work because it relys upon Server to be up to build astro stuff
> - Docker-compose doesn't work for the same reason as above

## Running project

Notes:

- Server ip and port are `192.168.4.20:25565`
- App ip and port are `192.168.4.69:1234`

### Using Docker Compose

Start:

```bash
docker-compose up -d
```

### Running single instances

#### With docker

```bash
docker network create --subnet 192.168.4.0/24 made-net
cd ./Server && ./run.sh
cd ./App && ./run.sh
```

> Tip
> The run script in the root of the project should do the things above

#### The Good 'old way

```bash
cd ./App && npm run dev
cd ./Server && node index.js
```

Design prototype [here](https://www.figma.com/file/soIM6stdzrFZcPKNfm7TLa/Figma-basics?type=design&node-id=1669%3A162202&mode=design&t=N0ED0ERf8inSXvcZ-1)
