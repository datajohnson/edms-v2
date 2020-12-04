FROM node:14-alpine3.10

RUN mkdir /home/node/app && chown -R node:node /home/node/app
RUN mkdir /home/node/app/files && chown -R node:node /home/node/app/files
WORKDIR /home/node/app
COPY --chown=node:node . .
#COPY --chown=node:node .env* ./

USER node
RUN npm install && npm cache clean --force --loglevel=error
RUN npm run build:api
EXPOSE 3000

CMD [ "node", "dist/index.js" ]