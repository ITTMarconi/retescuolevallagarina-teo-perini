# Cleaning
echo "Cleaning... (App)"
docker rm -f made-app_instance
docker image rm -f made-app

# Building
echo "Building... (App)"
docker build --progress=plain -t made-app . 

# Running
echo "Running... (App)"
docker run -it \
    -p 1234:1234 \
    --net made-net --ip 192.168.4.69 \
    --name made-app_instance made-app
