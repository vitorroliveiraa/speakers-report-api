#!/bin/bash
set -e

echo "🔁 Atualizando banco de dados (fora do Swarm)..."
docker compose -f /root/deploy/speakers-report-api/postgres-compose.yml --env-file /root/deploy/speakers-report-api/.env up -d

echo "🐳 Subindo serviços Swarm..."
docker stack deploy -c /root/deploy/speakers-report-api/docker-swarm.yml speakers-report

echo "📦 Verificando serviços Swarm..."
docker stack services speakers-report

echo "✅ Deploy finalizado!"
