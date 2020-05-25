#!/bin/bash

cd ~/ && git clone https://github.com/TupotaValentyn/MA.-Project.git
# !!! DEV BRANCH !!!
cd ~/MA.-Project/ && git checkout dev

# Build frontend
cd ~/MA.-Project/front-end/
npm install
npm run build

# Build backend
cd ~/MA.-Project/api/
npm install

# Build THIS ALL!!!
cd ~/MA.-Project/
docker-compose build

nginxImageId=`docker images | grep "ma-project_nginx" | awk '{print $3}'`
frontendImageId=`docker images | grep "ma-project_frontend" | awk '{print $3}'`
apiImageId=`docker images | grep "ma-project_api" | awk '{print $3}'`
mysqlImageId=`docker images | grep "ma-project_mysql" | awk '{print $3}'`

# Push Nginx
docker tag $nginxImageId alberkut/ma-project_nginx
docker push alberkut/ma-project_nginx
# Push Frontend
docker tag $frontendImageId alberkut/ma-project_frontend
docker push alberkut/ma-project_frontend
# Push API
docker tag $apiImageId alberkut/ma-project_api
docker push alberkut/ma-project_api
# Push MySql
docker tag $mysqlImageId alberkut/ma-project_mysql
docker push alberkut/ma-project_mysql

# Delete used repository
rm -rf ~/MA-.Project/

echo "#################################################"
echo "#               TODO: Custom path,              #"
echo "#               TODO: Custom branch,            #"
echo "#               TODO: Optimization Push,        #"
echo "#               TODO: Confirmation to delete,   #"
echo "#               TODO: Deployment automation.    #"
echo "#################################################"

