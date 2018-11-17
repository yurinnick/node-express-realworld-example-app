ARG NODE_VERSION=11.1-alpine
ARG NODE_ENV=production

# Base image
FROM node:${NODE_VERSION} AS node

# Build dependencies
FROM node AS build
WORKDIR /srv/nodeapp
COPY package.json /srv/nodeapp/
RUN npm install
COPY . /srv/nodeapp/

# Run application
FROM build AS release
ENTRYPOINT ["node", "./app.js"]
