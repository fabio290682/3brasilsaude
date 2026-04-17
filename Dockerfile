# syntax=docker/dockerfile:1

FROM node:20-slim AS angular-build
WORKDIR /app/angular-frontend
COPY angular-frontend/package.json ./
COPY angular-frontend/tsconfig.app.json ./
COPY angular-frontend/tsconfig.json ./
COPY angular-frontend/angular.json ./
COPY angular-frontend/src ./src
RUN npm install
RUN npm run build

FROM node:20-slim AS app
WORKDIR /app
COPY package.json ./
RUN npm install
COPY server ./server
COPY --from=angular-build /app/angular-frontend/dist ./angular-frontend/dist
COPY .env.example ./

EXPOSE 4000
ENV NODE_ENV=production
CMD ["npx", "tsx", "server/index.ts"]
