#!/bin/sh
set -e

: "${POSTGRES_PORT:=5432}"

echo "⏳ Waiting for database at $POSTGRES_HOST:$POSTGRES_PORT…"
while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done

echo "🚜 Running database migrations…"
npm run db:migrate:prod

echo "🌱 Seeding initial data…"
npm run db:seed

echo "🚀 Starting application…"
exec npm run start:prod
