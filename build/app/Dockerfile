#
# 🧑‍💻 Development
#
FROM node:18-alpine as dev

RUN mkdir -p /app

WORKDIR /app

ENV NODE_ENV development
 
COPY ["package.json", "package-lock.json", "./"]

RUN npm ci
 
COPY . .

#
# 🏡 Production Build
#
FROM node:18-alpine as build

ENV NODE_ENV production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

#
# 🚀 Production Server
#

FROM node:18-alpine as prod

ENV NODE_ENV production

WORKDIR /app

COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules

CMD [ "npm", "run", "start:prod" ]


