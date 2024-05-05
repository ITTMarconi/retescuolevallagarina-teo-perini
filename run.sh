docker network create --subnet 192.168.4.0/24 made-net
docker network 

cd ./Server && ./run.sh &
cd ./App && ./run.sh &
