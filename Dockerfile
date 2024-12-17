# Etapa 1: Construção
FROM node:18-slim AS builder

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    python3 make g++ openssl && \
    rm -rf /var/lib/apt/lists/*

# Copiar dependências
COPY package.json package-lock.json ./
RUN npm install --quiet --no-optional --no-fund --loglevel=error

# Copiar código-fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Executar build
RUN npm run build

# Etapa 2: Produção
FROM node:18-slim AS production

WORKDIR /app

# Instalar dependências de produção
RUN apt-get update && apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install --production --quiet --no-optional --no-fund --loglevel=error

# Copiar artefatos do build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Variáveis de ambiente
COPY .env.production .env

# Expor porta
EXPOSE 3000

# Definir ambiente
ENV NODE_ENV=production

# Iniciar aplicação
CMD ["node", "npm run prod"]
