FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

# instalar netcat
RUN apk add --no-cache bash netcat-openbsd

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["sh", "./entrypoint.sh"]
