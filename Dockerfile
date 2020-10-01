FROM node:lts

# Bundle app source
COPY index.js /index.js
COPY package*.json ./

RUN npm install

RUN ["chmod", "+x", "index.js"]

ENTRYPOINT ["node", "/index.js"]