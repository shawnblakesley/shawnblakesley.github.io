#!/usr/bin/env bash

# if no SERVER_IP raise warning
if [ -z "${SERVER_IP}" ]; then
  echo "You must set the SERVER_IP ${SERVER_IP} to point to the host"
  exit
fi
cd $(dirname "$0")
gulp images --compress-images
pushd ../dist
tar -czvf images.tar.gz images
popd
scp -r ../dist/images.tar.gz root@${SERVER_IP}:/root
scp ./update_server.sh root@${SERVER_IP}:/root/update_server.sh
ssh -t root@${SERVER_IP} ./update_server.sh $(echo https://index.docker.io/v1/ | docker-credential-osxkeychain get | jq ".Secret")

