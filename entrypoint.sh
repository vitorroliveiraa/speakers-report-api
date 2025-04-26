#!/bin/sh
set -ex

# Lê os secrets do Docker Swarm
DB_USER=$(cat "$DB_PROD_USER_FILE")
DB_PASSWORD=$(cat "$DB_PROD_PWD_FILE")

# Espera o banco de dados estar disponível (exemplo simples)
until PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  echo "Esperando pelo banco de dados..."
  sleep 5
done

echo "Banco de dados disponível. Executando as migrations..."
npx knex migrate:latest --knexfile dist/database/knexfile.js

echo "Migrations concluídas. Iniciando a aplicação..."
exec node dist/server.js "$@"
