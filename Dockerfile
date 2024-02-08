FROM node:lts-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /home/node/vns
COPY package*.json .
RUN npm install
COPY . .
CMD [ "/bin/bash", "./init.sh" ]