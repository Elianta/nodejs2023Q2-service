#
# 🧑‍💻 Development
#
FROM node:18.17.1-alpine as dev

RUN mkdir -p /app

WORKDIR /app

ENV NODE_ENV development
 
COPY ["package.json", "package-lock.json", "./"]

RUN npm ci
 
COPY . .

#
# 🏡 Production Build
#
FROM node:18.17.1-alpine as build

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

COPY --from=dev /app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci && npm cache clean --force

#
# 🚀 Production Server
#

FROM node:18.17.1-alpine as prod

ENV NODE_ENV production

WORKDIR /app

COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules

CMD [ "npm", "run", "start:prod" ]


