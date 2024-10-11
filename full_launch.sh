set -e

# Set ip and port!!!
vi Data/constants.js
vi Data/constants.ts

#####


# Build and start server
echo -e "\n\033[36mBuilding and starting the server...\033[0m\n"
cd Server

chmod +x server_run.sh
./server_run.sh

# curl http://<SERVER_IP>:<SERVER_PORT>/Data/Istituti/Arcivescovile/data.json

cd ..


# Build app
echo -e "\n\033[36mBuilding application...\033[0m\n"
cd App
npm install
npm run build

cd ..


# Kill server
echo -e "\n\033[36mKilling the running server instance...\033[0m\n"
docker stop made-server_instance


# Start docker compose
echo -e "\n\033[36mStarting docker compose\033[0m\n"
docker compose build
docker compose up

# # Test if server is up and running
# curl http://<SERVER_IP>:<SERVER_PORT>/Data/Istituti/Arcivescovile/data.json

# # Test if app it's running
# curl http://<SERVER_IP>/
