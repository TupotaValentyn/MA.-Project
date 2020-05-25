#!/bin/bash

if [[ "$EUID" -ne 0  ]]
then
	echo "Please run as root";
	exit 0;
fi

# Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -;
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt install -y docker-ce docker-compose

user=`echo $USER`
usermod -aG docker $user
service docker restart

echo "Please log out and log in to use docker"

