# Etapa 1: Construção
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos package.json e instala as dependências de desenvolvimento
COPY package*.json ./
RUN npm install

# Copia todo o código-fonte e executa o build
COPY . .
RUN npm run build

# Etapa 2: Produção
FROM node:18-alpine AS production

WORKDIR /app

# Copia apenas os arquivos de produção
COPY package*.json ./
RUN npm install --only=production

# Copia o build da etapa anterior
COPY --from=builder /app/dist ./dist

# Define as variáveis de ambiente de produção
ENV NODE_ENV production

EXPOSE 3000

# Usa o script "prod" definido no package.json
CMD ["npm", "run", "prod"]
