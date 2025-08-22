#!/bin/sh
set -e

# Lê os secrets do Docker Swarm
DB_USER=$(cat "$DB_PROD_USER_FILE")
DB_PASSWORD=$(cat "$DB_PROD_PWD_FILE")

# Função para testar conexão sem expor credenciais
test_db_connection() {
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q' > /dev/null 2>&1
}

# Espera o banco de dados estar disponível
echo "Verificando conexão com o banco de dados..."
until test_db_connection; do
  echo "Aguardando o banco de dados ficar disponível..."
  sleep 5
done

echo "Banco de dados disponível. Executando as migrations..."
npx knex migrate:latest --knexfile dist/database/knexfile.js

echo "Migrations concluídas. Iniciando a aplicação..."

echo "Iniciando com NODE_ENV=$NODE_ENV e DB_USER=$DB_USER"

exec node dist/server.js "$@"
