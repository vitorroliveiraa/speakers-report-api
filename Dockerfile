# Stage 1: Builder (comum para ambos ambientes)
FROM node:22-alpine3.20 AS builder
WORKDIR /app

# Copia os arquivos necessários
COPY package*.json ./
RUN npm ci --include=dev

# Copia o restante da aplicação
COPY . .

# Faz o build com NODE_ENV=production (sem migration ainda)
ENV NODE_ENV=production
RUN npm run build && npm run postbuild

# Etapa de produção
FROM node:22-alpine3.20 AS production
WORKDIR /app

# Copia apenas os artefatos finais
COPY --from=builder /app /app

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
