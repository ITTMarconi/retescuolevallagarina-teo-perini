# Cleaning
echo "Cleaning... (Server)"
docker rm -f made-server_instance
docker image rm -f made-server

# Building
echo "Building... (Server)"
docker build -t made-server .
# --progress=plain

# Running
echo "Running... (Server)"
docker run -it \
    -v /$(pwd)/../Data:/MaDe/Data \
    -p 25565:25565 \
    --net made-net --ip 192.168.4.20 \
    --name made-server_instance made-server
