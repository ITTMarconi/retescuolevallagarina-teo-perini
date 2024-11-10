# Cleaning
echo "Cleaning... (App)"
docker rm -f made-app_instance
docker image rm -f made-app

if [ ! -d "./public/media" ]; then
	echo "Media is not included!!"
	exit 1
fi

# Building
echo "Building... (App)"
docker build --progress=plain -t made-app .

# Running
echo "Running... (App)"
docker run -d \
    -p 8080:80 \
    --name made-app_instance made-app
