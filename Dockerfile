FROM node:lts
WORKDIR /home/node/vns
COPY package*.json .
RUN npm install
COPY . .
CMD [ "/bin/bash", "./init.sh" ]