FROM node:20-alpine as dev

ENV NODE_ENV development

WORKDIR /srv

COPY package.json /srv/package.json
COPY package-lock.json /srv/package-lock.json

RUN npm install

CMD ["npm", "start"]

FROM dev as build

ENV NODE_ENV production

COPY . /srv

RUN npm run build

FROM node:20-alpine as prod

ENV NODE_ENV production

WORKDIR /srv

RUN npm install -g serve

COPY --from=build /srv/dist /srv/dist

CMD ["serve", "-s", "dist", "-l", "3000"]
