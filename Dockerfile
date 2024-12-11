# Etapa 1: Construção
FROM node:18-alpine3.16 AS builder

# Alterar repositórios para evitar problemas de rede
RUN sed -i 's/dl-cdn.alpinelinux.org/mirror.leaseweb.com/g' /etc/apk/repositories

# Instalar dependências do sistema
RUN apk add --no-cache openssl bash

WORKDIR /app

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
FROM node:18-alpine3.16 AS production

# Alterar repositórios para evitar problemas de rede
RUN sed -i 's/dl-cdn.alpinelinux.org/mirror.leaseweb.com/g' /etc/apk/repositories

# Instalar dependências do sistema
RUN apk add --no-cache openssl bash

WORKDIR /app

# Instalar dependências de produção
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
ENV NODE_ENV production

# Iniciar aplicação
CMD ["npm", "run", "prod"]