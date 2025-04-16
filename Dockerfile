# Stage 1: Builder (comum para ambos ambientes)
FROM node:22-alpine3.20 AS builder
WORKDIR /app

# Copia os arquivos necessários
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copia o restante da aplicação
COPY . .

# Faz o build com NODE_ENV=production (sem migration ainda)
ENV NODE_ENV=production
RUN npm run build

# Etapa de produção
FROM node:22-alpine3.20 AS production
WORKDIR /app

# Copia apenas os artefatos finais
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env .env

ENV NODE_ENV=production

# Aplicar migrations e iniciar
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]
