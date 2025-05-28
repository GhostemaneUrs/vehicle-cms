# Stage 1: build con Node 22
FROM node:22-alpine AS builder
WORKDIR /app

# limpiar dist
RUN npm install -g rimraf

# instalar deps
COPY package*.json ./
RUN npm ci

# copiar código y compilar
COPY . .
RUN npm run build

# Stage 2: prod
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# instalar netcat para el wait-for-db
RUN apk add --no-cache bash netcat-openbsd

# solo deps de prod
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# copiar build y entrypoint
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["sh", "./entrypoint.sh"]
