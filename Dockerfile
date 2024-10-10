# Etapa 1: Construção
FROM node:18-alpine AS builder

WORKDIR /app

# Copia o package.json e instala TODAS as dependências
COPY package*.json ./
RUN npm install --quiet --no-optional --no-fund --loglevel=error

# Copia o código-fonte após instalar dependências
COPY . .

# Gera o Prisma Client ANTES do build
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Executa o build da aplicação
RUN npm run build

# Etapa 2: Produção
FROM node:18-alpine AS production

WORKDIR /app

# Copia o package.json e instala as dependências de produção
COPY package*.json ./
RUN npm install --only=production

# Copia o build e o Prisma Client da etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Expor a porta 3000
EXPOSE 3000

# Define a variável de ambiente padrão como "production"
ENV NODE_ENV production

# Comando de execução
CMD ["npm", "run", "prod"]
