# Introduction

TODO

## Deployment

The entire application is made of two components: client and server. They should be deployed separately.

### Using Docker Compose

Docker compose is the easiest way to launch the application. Just run the following command:

```bash
docker-compose up
```

### Using Docker

First of all, let's build docker image for the server. We can do that by running the following `docker build` command:
```bash
docker build -t image-retail-site-location-dss-server ./server
```

Once docker image for the server is ready we can build another image for the client. For that we can run following `docker build` command:
```bash 
docker build -t image-retail-site-location-dss-client ./client
```

The server should be launched first:

```bash
docker run \
    --name Retail-Site-Location-DSS-BE \
    -p 8000:8000 \
    -v $(pwd)/server/init.yaml:/app/init.yaml \
    -v $(pwd)/server/data:/app/data \
    -v $(pwd)/server/database:/app/database \
    image-retail-site-location-dss-server
```

And then the client:

```bash
docker run --name Retail-Site-Location-DSS-FE \
           -p 3000:3000 \
           -v $(pwd)/client/src:/client/src \
           -v $(pwd)/client/package.json:/client/package.json \
           -v /node_modules \
           -it \
           image-retail-site-location-dss-client
```