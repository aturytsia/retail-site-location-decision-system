# Introduction

Location plays a key role in the success of a business. No amount of property features such as building, decorating, or price can overcome the negative impact of a poor location. A strategically positioned business not only reduces financial risks but also enhances the likelihood of achieving success. This system implements a methodology to assist retailers in making informed location decisions.

## Folder Structure

- `client` - React folder (Front-End)
    - `public` - Folder with static files
    - `src` - Folder with all the react components
        - `assets` - images and videos used in the project
        - `components` - shared components for all the pages
        - `hooks` - custom hooks
        - `pages` - page components
        - `utils` - folder with utilities
        - App.tsx - routing file
        - index.tsx - react entry file
        - index.css - global css styles
    - Dockerfile - docker configuration
    - .dockerignore
    - jest.config.js - jest configuration
    - globals.d.ts
    - .eslintignore
    - .eslint
    - package.json
    - tsconfig.json
- `server` - Fast API folder (Back-End)
    - `database` - Folder with Brno datasets for demo application
        - `archive` - Archive folder with irrelevant files
        - `demo` - Brno datasets
    - `env` - Python virtual environment
    - `scripts` - Folder with crucial scripts
        - ahp.py - AHP implementation
        - geocompetition - Competition evaluating functions
    - `tests` - Testing related data
    - Dockerfile - docker configuration
    - .dockerignore
    - init.yaml - Server configuration file
    - main.py - Server's entry file
    - requirements.txt - Required libraries for the server
    - settings.py - Script that reads configuration
    - test.py - Script for server testing
    - utils.py - Script with utilities
- `excel` - Excel conference related files
    - abstrakt.pdf
    - nahled.png
    - poster.pdf
- `latex` - Latex source code for thesis
thesis.pdf - The thesis
.gitignore
compose.yml # docker-compose file to launch this system using docker
README.md # You are here

## How to Launch a System

The entire application is made of two components: client and server. They should be deployed separately.

- Front-End will be available at `localhost:3000`
- Server will be available at `localhost:8000`

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

### Using Node and Python

For the front-end was used node version **v20.11.1**, for the back-end python version **3.11.8**.

First of all, let's install all the required dependencies for the front-end application. Go to the `client` folder and using `npm` install all the dependencies:

```bash
cd client
npm i
```

Once it is done, you can run the server:

```bash
npm start
```

As the second step, let's activate virual environment for the server. Go to the `server` folder, create virtual environment and then activate it:

```bash
cd server
python -m venv env
source /env/bin/activate
```

Once it is done, you can safely install all the required dependencies:

```bash
python -m pip install -r requirements.txt
```

When installations are finished, you can launch the server using following command:

```bash
uvicorn main:app --reload
```

## How to use it?

### Core Components

Before diving into the system, it is important to understand what are the key components:

#### Menu

The menu acts as a straightforward navigation element positioned on the left side of the screen. It helps user to navigate between 3 tabs: Site Selection Process, Layers and Help. Each tab can be found by the following icons:

- **The site selection process tab** is responsible for guiding using through the process.
- **Layers** tab contains information about the data this system is initialized with.
- **Help** tab displays information you are currently reading.

#### Map

The map serves as a central component. Upon selecting a business type, the map presents users with information regarding highly competitive areas. As illustrated in the screenshot below, red-colored regions indicate areas where customers are more likely to travel to the nearest competitor's outlets.

![](./client/src/pages/Help/assets/map.png)

### Available Data

The system can be initialized with various datasets, but in the current instance, it depends on data sourced from [data.brno](https://data.brno.cz/).


Here are the datasets that the system is utilizing:

- [Number of People Living at the Addresses](https://arcg.is/1Lfbzb0)
- [Brno Retail Research](https://arcg.is/0CaaCS)

### Demo

Below is a straightforward demonstration showcasing the complete process of selecting a location for the bakery in Brno.

![](./client/src/pages/Help/assets/demo.gif)