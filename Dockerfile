FROM node:20

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

COPY --chown=node:node . .

RUN npm install

RUN npm run disable:telemetry

ENV NODE_OPTIONS --max_old_space_size=8192

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "serve"]