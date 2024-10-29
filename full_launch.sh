set -e

#####

echo "Check to have properly set ip and port!!!"

#####

# Build and start server
echo -e "\n\033[36mBuilding and starting the server...\033[0m\n"
cd Server

chmod +x server_run.sh
./server_run.sh

cd ..

# Build app
echo -e "\n\033[36mBuilding application...\033[0m\n"
cd App
npm install
npm run build


# Kill server
echo -e "\n\033[36mKilling the running server instance...\033[0m\n"
docker stop made-server_instance


# Start application
echo -e "\n\033[36mStarting application\033[0m\n"

chmod +x app_run.sh
./app_run.sh
