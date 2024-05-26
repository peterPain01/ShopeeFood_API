FROM node:18-alpine

WORKDIR /app 

COPY package*.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

RUN adduser -D shoppefood

RUN chown -R shoppefood:shoppefood /app

USER shoppefood

COPY . .

EXPOSE ${PORT}
CMD [ "npm", "run", "dev" ]