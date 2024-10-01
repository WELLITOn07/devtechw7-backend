# Etapa 1: Construção
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos package.json e instala TODAS as dependências
COPY package*.json ./
RUN npm install

# Copia o código-fonte e executa o build
COPY . .
RUN npm run build

# Gera o Prisma Client e executa as migrações após o build
RUN npx prisma migrate deploy --schema=/app/prisma/schema.prisma
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Etapa 2: Produção
FROM node:18-alpine AS production

WORKDIR /app

# Copia o package.json e as dependências de produção
COPY package*.json ./
RUN npm install --only=production

# Copia o build da etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Define a variável de ambiente padrão como "production"
ENV NODE_ENV production

# Exponha a porta 3000
EXPOSE 3000

# Comando de execução que verifica o ambiente e usa o script adequado
CMD if [ "$NODE_ENV" = "production" ]; \
  then npm run prod; \
  else npm run dev; \
  fi
