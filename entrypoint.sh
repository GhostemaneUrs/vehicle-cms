#!/bin/sh
set -e

# si no viene POSTGRES_PORT, por defecto 5432
: "${POSTGRES_PORT:=5432}"

echo "⏳ Waiting for database at $POSTGRES_HOST:$POSTGRES_PORT…"
# hasta que abra el puerto, duerme 1s
while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done

echo "🚜 Running database migrations…"
npm run db:migrate:prod

echo "🌱 Seeding initial data…"
npm run db:seed:prod

echo "🚀 Starting application…"
exec npm run start:prod
