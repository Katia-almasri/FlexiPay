#Stage 1
FROM node:current-alpine3.21 AS base

RUN apk --update npm curl
COPY . /src
WORKDIR /src
RUN npm install && npm run build

#Stage 2
FROM alpine:3.22.0

WORKDIR /src

COPY --from=base src/dist ./dist
COPY --from=base /src/package.json ./package.json
EXPOSE 5000
ENTRYPOINT [ "npm", "run", "start" ]