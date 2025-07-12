FROM alpine:latest 

RUN apk add --update nodejs npm curl

COPY . /src

WORKDIR /src

RUN npm install

EXPOSE 5000

ENTRYPOINT [ "npm", "run", "start" ]
