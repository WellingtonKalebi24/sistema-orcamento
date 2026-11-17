#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "$0")/.."
umask 077
compose=(docker compose -f docker-compose.production.yml)
backup="backups/documentos-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup"
# Build before interrupting the running application.
"${compose[@]}" build api web
"${compose[@]}" exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "$backup/database.dump"
"${compose[@]}" exec -T postgres pg_restore --list < "$backup/database.dump" > "$backup/database-list.txt"
grep -q 'TABLE DATA public User' "$backup/database-list.txt" || { echo "Backup sem tabela de usuarios. Atualizacao interrompida."; exit 1; }
"${compose[@]}" exec -T api tar -C /app/uploads -cf - . > "$backup/uploads.tar"
"${compose[@]}" stop api
trap '"${compose[@]}" start api >/dev/null || true' EXIT
"${compose[@]}" run --rm --no-deps -T api npm run prisma:deploy --workspace backend
"${compose[@]}" up -d --no-deps api web
trap - EXIT
"${compose[@]}" ps
printf '\nAtualizacao aplicada. Backup preservado em %s\n' "$backup"
