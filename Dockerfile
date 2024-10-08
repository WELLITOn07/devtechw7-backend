# Etapa 1: Construção
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos package.json e instala TODAS as dependências
COPY package*.json ./
RUN npm install --quiet --no-optional --no-fund --loglevel=error

# Copia o código-fonte e executa o build
COPY . .
RUN npm run build

# Gera o Prisma Client e executa as migrações após o build
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Etapa 2: Produção ou Desenvolvimento com Debug
FROM node:18-alpine AS production

WORKDIR /app

# Copia o package.json e as dependências de produção
COPY package*.json ./
RUN npm install --only=production

# Copia o build da etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Expor as portas 3000 (app) e 9229 (debug)
EXPOSE 3000 9229

# Define a variável de ambiente padrão como "production"
ENV NODE_ENV production

# Comando de execução que verifica o ambiente, roda testes (em prod), e usa o script adequado
CMD if [ "$NODE_ENV" = "production" ]; \
  then npm run test && npm run prod; \
  else npm dev:debug; \
  fi
