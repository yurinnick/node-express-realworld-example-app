ARG NODE_VERSION=11.1-alpine
FROM node:${NODE_VERSION} AS node

FROM node AS build

WORKDIR /srv/nodeapp

COPY package.json /srv/nodeapp/
RUN yarn --pure-lockfile
COPY . /srv/nodeapp/

FROM build AS release
ENTRYPOINT ["node", "./app.js"]
