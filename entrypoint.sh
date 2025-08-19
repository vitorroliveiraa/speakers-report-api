#!/bin/sh
set -ex

# Lê os secrets do Docker Swarm
DB_USER=$(cat "$DB_PROD_USER_FILE")
DB_PASSWORD=$(cat "$DB_PROD_PWD_FILE")

# Espera o banco de dados estar disponível (exemplo simples)
until PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  echo "Esperando pelo banco de dados..."
  sleep 5
done

echo "Banco de dados disponível. Executando as migrations..."
npx knex migrate:latest --knexfile dist/database/knexfile.js

echo "Migrations concluídas. Iniciando a aplicação..."

echo "Iniciando com NODE_ENV=$NODE_ENV e DB_USER=$DB_USER"

exec node dist/server.js "$@"
