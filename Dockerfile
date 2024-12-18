# Etapa 1: Construção
FROM node:18-slim AS builder

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    python3 make g++ openssl libssl3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copiar dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install --legacy-peer-deps --quiet --no-optional --no-fund --loglevel=error

# Copiar código-fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Executar build
RUN npm run build

# Etapa 2: Produção
FROM node:18-slim AS production

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    libssl3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Variáveis de ambiente
COPY .env.production .env

# Copiar apenas os arquivos necessários do estágio builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3000

# Definir ambiente
ENV NODE_ENV=production

# Iniciar aplicação
CMD ["node", "dist/main"]
