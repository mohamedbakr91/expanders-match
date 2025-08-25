#!/bin/sh

echo "⏳ Waiting for MySQL to be ready..."

# استنى لحد ما MySQL يبقى جاهز
until nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
  echo "⏳ Still waiting for DB at $DATABASE_HOST:$DATABASE_PORT..."
  sleep 2
done

echo "✅ DB is up, running migrations..."

npm run db:create
npm run db:migrate
npm run db:seed

echo "🚀 Starting app..."
npm start
