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
    -p 80:80 \
    -v /$(pwd)/Data:/MaDe/Data \
    --name made-app_instance made-app
