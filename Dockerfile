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
RUN npm run build

# Etapa de produção
FROM node:22-alpine3.20 AS production
WORKDIR /app

# Copia apenas os artefatos finais
#COPY --from=builder /app /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app/

#ENV NODE_ENV=production
# Copia o script de entrada
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

ENV NODE_ENV=production
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USER=${DB_USER_FILE}
ENV DB_PASSWORD=${DB_PWD_FILE}
ENV DB_NAME=${DB_NAME}

ENTRYPOINT ["./entrypoint.sh"]
