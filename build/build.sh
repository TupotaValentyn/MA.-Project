#!/bin/bash

nginxImageID=`docker images | grep "ma-project_nginx" | awk '{print $3}'`
mysqlImageID=`docker images | grep "ma-project_mysql" | awk '{print $3}'`
frontendImageID=`docker images | grep "ma-project_frontend" | awk '{print $3}'`
apiImageID=`docker images | grep "ma-project_api" | awk '{print $3}'`

nginx="alberkut/ma-project_nginx"
mysql="alberkut/ma-project_mysql"
frontend="alberkut/ma-project_frontend"
api="alberkut/ma-project_api"

user=`echo $USER`
rootDirPath="/home/$user/Documents"
projectPath="${rootDirPath}/MA.-Project/"
frontPath="${projectPath}/front-end/"
apiPath="${projectPath}/api/"

gitBranchName="dev"

sshPathToKey="~/.ssh/admin-key.pem"
sshHostURL="ubuntu@3.250.170.88"

cd $rootDirPath && git clone https://github.com/TupotaValentyn/MA.-Project.git
# !!! DEV BRANCH !!!
cd $projectPath && git checkout $gitBranchName

# Build frontend
cd $frontPath
npm install
npm run build

# Build backend
cd $apiPath
npm install

# Build THIS ALL!!!
cd $projectPath
docker-compose build

# Push Nginx
docker tag $nginxImageId $nginx && docker push $nginx
# Push MySql
docker tag $mysqlImageId $mysql && docker push $mysql
# Push Frontend
docker tag $frontendImageId $frontend && docker push $frontend
# Push API
docker tag $apiImageId $api && docker push $api

# Delete used repository
rm -rf $projectPath

# Ssh connect
ssh -i $sshPathToKey $sshHostURL << EOF
	cd ~/MA.-Project/
	docker pull $nginx
	docker pull $mysql
	docker pull $frontend
	docker pull $api

	docker-compose down
	docker-compose up -d
EOF

echo "#################################################"
echo "#               TODO: Optimization Push,        #"
echo "#               TODO: Confirmation to delete,   #"
echo "#################################################"

