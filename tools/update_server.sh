#! /bin/sh
#

trap 'docker logout; tput sgr0' EXIT
r=9
g=10
y=11
b=12
p=13
echo "$(tput setaf $b)Logging in to $(tput setaf $g)shawnblakesley$(tput setaf $b) at $(tput setaf $g)https://hub.docker.com$(tput sgr0)"
docker login -u shawnblakesley -p $1
echo "$(tput setaf $b)Extracting images$(tput sgr0)"
tar -xzvf images.tar.gz
echo "$(tput setaf $b)Stopping running process $(tput setaf $g)uptown_unicorn$(tput setaf $b).$(tput sgr0)"
docker stop uptown_unicorn
echo "$(tput setaf $b)Cleaning old docker images and files.$(tput sgr0)"
tput setaf $p
docker system prune -f
tput sgr0
echo "$(tput setaf $b)Pulling image $(tput setaf $g)shawnblakesley/server$(tput setaf $b) as $(tput setaf $g)latest$(tput setaf $b).$(tput sgr0)"
docker pull shawnblakesley/server
echo "$(tput setaf $b)Launching image $(tput setaf $g)shawnblakesley/server:latest$(tput setaf $b) as $(tput setaf $g)uptown_unicorn$(tput setaf $b).$(tput sgr0)"
echo "$(tput setaf $b)Container is set to $(tput setaf $g)always$(tput setaf $b) restart.$(tput sgr0)"
tput setaf $p
docker run -v /root/images:/static/images -v /var/log/server:/var/log/server -v /usr/local/cert/.well-known:/static/.well-known -v /etc/letsencrypt:/etc/letsencrypt -p 80:80 -p 443:443 --name uptown_unicorn --restart always -d shawnblakesley/server
tput sgr0
echo "$(tput setaf $g)Success!$(tput sgr0)"