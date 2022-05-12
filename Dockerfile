FROM node:17.9.0-alpine3.14 as development
WORKDIR /home/node/tui_test

COPY . .

COPY package*.json ./
RUN npm i

CMD npm run start:dev

EXPOSE 3000 9229

FROM node:17.9.0-alpine3.14 as production
WORKDIR /home/node/tui_test

COPY --from=development /home/node/tui_test ./
RUN npm i --production

CMD npm run start:prod

EXPOSE 3000
