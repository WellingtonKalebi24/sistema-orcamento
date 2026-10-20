FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --include=dev

FROM deps AS build
COPY . .
RUN npm run build --workspace backend

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
COPY backend/package.json backend/package.json
RUN npm ci --omit=dev --workspace backend
COPY --from=build /app/backend/dist backend/dist
COPY backend/prisma backend/prisma
RUN npm run prisma:generate --workspace backend
EXPOSE 3333
CMD ["node", "backend/dist/server.js"]
