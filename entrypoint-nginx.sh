#!/bin/sh
# Garante que o script pare se algum comando falhar
set -e

# O nome do serviço da API e a porta, conforme definido no docker-swarm.yml
API_HOST="api-production"
API_PORT="3000"

# Loop 'until' que tenta se conectar ao host da API na porta especificada.
# O comando 'nc -z' (netcat) verifica se a porta está aberta sem enviar dados.
echo "Aguardando a API em ${API_HOST}:${API_PORT}..."
until nc -z "${API_HOST} ${API_PORT}"; do
  echo "API indisponível. Tentando novamente em 5 segundos..."
  sleep 5
done

echo "API está disponível! Iniciando o Nginx..."

# O comando 'exec "$@"' é muito importante.
# Ele substitui o processo do shell pelo comando original do container (o Nginx).
# Isso garante que o Nginx se torne o processo principal (PID 1),
# permitindo que ele receba sinais do Docker corretamente (como para parar o container).
exec "$@"
