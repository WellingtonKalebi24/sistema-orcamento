FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY frontend/package.json frontend/package.json
RUN npm ci --include=dev

FROM deps AS build
COPY frontend frontend
RUN npm run build --workspace frontend

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
