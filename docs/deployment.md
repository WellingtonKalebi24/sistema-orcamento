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

## Atualização do PDF e erro `prisma: not found`

Se a montagem falha, o contêiner anterior continua atendendo e o PDF mantém o layout antigo.
O Prisma CLI faz parte das dependências de produção do backend, na mesma versão do cliente;
a imagem gera o cliente pelo script `prisma:generate`, sem depender de download via `npx`.

Para atualizar somente a API após baixar a correção:

```bash
cd /root/sistema-orcamento &&
git pull --ff-only origin 001-sistema-orcamentos &&
docker compose -f docker-compose.production.yml build api &&
docker compose -f docker-compose.production.yml up -d --no-deps --force-recreate api &&
docker compose -f docker-compose.production.yml exec -T api node -e 'const fs=require("fs"); const s=fs.readFileSync("/app/backend/dist/providers/pdf/quote-pdf.provider.js","utf8"); if (!s.includes("Dados do orçamento")) process.exit(1); console.log("PDF NOVO instalado");'
```

Esta correção de montagem e layout não exige migração nem remove volumes.
