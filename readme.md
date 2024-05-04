# kcal

Collect data about what you've eaten, in your own home network.

### docker

```bash
# build image
docker build -t evilgrin-website .
# check
docker images
# run container
docker run --name evilgrin-website -p 80:8080 -d evilgrin-website
# check
docker ps
# logs
docker logs evilgrin-website
# stop
docker stop <containerId>
# clean up (caution!) deletes all system container and images
docker system prune -a
```

