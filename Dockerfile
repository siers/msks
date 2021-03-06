FROM node:7.6-alpine

ENV NODE_ENV=production

RUN mkdir -p /usr/src/app
COPY .git /usr/src/app/.git
COPY common /usr/src/app/common
COPY server /usr/src/app/server

WORKDIR /usr/src/app
RUN apk add --no-cache --virtual git && \
    echo $(git rev-parse HEAD) >> VERSION && \
    echo $(git name-rev --tags --name-only $(git rev-parse HEAD)) >> VERSION && \
    echo $(git describe --tags HEAD) >> VERSION && \
    echo $(git show -s --format=%s) >> VERSION && \
    echo $(git show -s --format=%ci) >> VERSION && \
    rm -rf .git

WORKDIR /usr/src/app/common
RUN yarn install

WORKDIR /usr/src/app/server
RUN yarn install

CMD yarn start
