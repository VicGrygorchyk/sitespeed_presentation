#!/bin/bash

locations=("Dulles" "gce-europe-west1-linux" "ec2-ap-southeast-2")
profiles=("Cable" "3G")
time_out=180
folderTest=1

# config.json
config1="{\"browsertime\":{\"browser\":\"chrome\",\"iterations\":1,\"preScript\":[\"login.js\",\"search.js\"],\"connectivity\":{\"profile\":"
config2="},\"viewPort\":\"1920x1080\",\"delay\":\"3000\"},\"crawler\":{\"depth\":1}, \"outputFolder\":\""
config3="\",\"utc\":true,\"webpagetest\":{\"key\":\"A.a4e40860e6df00956bf151d5f3d05002\",\"connectivity\":"

# config network for speed throttle
docker network create --driver bridge --subnet=192.168.33.0/24 --gateway=192.168.33.10 --opt "com.docker.network.bridge.name"="docker3g" 3g
sudo tc qdisc add dev docker3g root handle 1: htb default 12
sudo tc class add dev docker3g parent 1:1 classid 1:12 htb rate 1.0mbit ceil 1.0mbit
sudo tc qdisc add dev docker3g parent 1:12 netem delay 180ms

docker network create --driver bridge --subnet=192.168.34.0/24 --gateway=192.168.34.10 --opt "com.docker.network.bridge.name"="docker-cable" cable
sudo tc qdisc add dev docker-cable root handle 1: htb default 12
sudo tc class add dev docker-cable parent 1:1 classid 1:12 htb rate 5mbit ceil 5mbit
sudo tc qdisc add dev docker-cable parent 1:12 netem delay 14ms

for city in ${locations[@]}; do
	for prof in ${profiles[@]}; do
		clear
		# ${prof,,} makes lowercase
		echo "Starting sitespeed.io frontend performance testing with ${prof,,}, location $city"
		# config location for test
		resultFolder="output/$folderTest"
		echo $config1 "\"${prof,,}\"" $config2$resultFolder$config3 "\"$prof\", \"location\": \"$city\"}}" > config.json
		# set timeout for test to complete
		timeout -k 0 $time_out docker run --shm-size=1g --network=${prof,,} --rm -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io --config config.json url.txt
		folderTest=$((folderTest+1))
		rm config.json
	done
done

# removing networks
docker network rm 3g
docker network rm cable