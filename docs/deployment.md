# Deploy Inicial

## Checklist

- Definir `POSTGRES_PASSWORD`, `DATABASE_URL`, `JWT_PRIVATE_KEY`, `COOKIE_SECRET` e `CORS_ORIGIN`.
- Rodar `npm ci`, `npm run build` e `npm run validate:openapi` antes de publicar.
- Executar migrations com `npm run prisma:deploy --workspace backend`.
- Executar seed controlado com `npm run prisma:seed --workspace backend` apenas em ambiente novo.
- Garantir volume persistente para `UPLOAD_DIR`.
- Fazer backup do PostgreSQL antes de atualizacoes.

## Docker Compose

```bash
docker compose -f docker-compose.production.yml up -d --build
```

O frontend fica em `http://localhost:8080` e a API em `http://localhost:3333`.
