# # build environment
# # FROM node:13.12.0-alpine as builder
# # WORKDIR /app
# # ENV PATH /app/node_modules/.bin:$PATH
# # COPY ./package.json ./
# # COPY ./package-lock.json ./
# # RUN npm ci --silent
# # RUN npm install react-scripts@3.4.1 -g --silent
# # COPY . ./
# # RUN npm run build
#
# FROM mhart/alpine-node:12 AS builder
# WORKDIR /app
# COPY . .
# RUN yarn run build
#
# # production environment
# FROM nginx:stable-alpine
# COPY --from=builder /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

FROM node:13.1-alpine as build

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn cache clean && yarn --update-checksums
COPY . ./
RUN yarn && yarn build

# Stage - Production
FROM nginx:1.17-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
