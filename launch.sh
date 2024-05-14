# Set ip and port!!!
vi Data/constants.js
vi Data/constants.ts
#####

# Build and start server
cd Server

chmod +x server_run.sh
./server_run.sh

# DO NOT STOP SERVER

# check if the server is on
# curl http://<SERVER_IP>:<SERVER_PORT>/Data/Istituti/Arcivescovile/data.json

cd ..

# Build app
cd App
npm install
npm run build

cd ..


# Kill server
docker stop made-server_instance

docker-compose build
docker-compose up

# # Test if server is up and running
# curl http://<SERVER_IP>:<SERVER_PORT>/Data/Istituti/Arcivescovile/data.json

# # Test if app it's running
# curl http://<SERVER_IP>/