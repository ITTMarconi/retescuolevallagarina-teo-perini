# Cleaning
echo "Cleaning..."
docker rm -f made-app_instance
docker image rm -f made-app

# Building
echo "Building..."
docker build --progress=plain -t made-app . 

# Running
echo "Running..."
docker run -it \
    -p 8080:80 \
    --name made-app_instance made-app
