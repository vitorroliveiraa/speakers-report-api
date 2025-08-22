#!/bin/sh
set -e

HOST="speakers-report_api-production"
PORT="3000"

echo "Verificando se a API em ${HOST}:${PORT} está disponível..."

while ! nc -z ${HOST} ${PORT}; do
  echo "API indisponível. Tentando novamente em 5 segundos..."
  sleep 5
done

echo "API disponível! Iniciando o Nginx..."

# Execute o comando padrão do Nginx
exec nginx -g "daemon off;"
