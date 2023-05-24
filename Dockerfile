FROM node:18-alpine as base
RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock /app
RUN yarn install --frozen-lockfile
COPY . /app
EXPOSE 5173
CMD ["yarn", "dev"]

