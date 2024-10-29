# Cleaning
echo "Cleaning... (Server)"
docker rm -f made-server_instance
docker image rm -f made-server

# Building
echo "Building... (Server)"
docker build --progress=plain -t made-server . 

# Running
echo "Running... (Server)"
docker run -d \
    -p 25565:25565 \
    -v /$(pwd)/../Data:/MaDe/Data \
    --name made-server_instance made-server
