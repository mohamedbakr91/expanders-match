#!/bin/sh
set -e

echo "Waiting for database to be ready..."

until nc -z $DB_HOST $DB_PORT; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up - running migrations & seeds"

npm run db:create || true
npm run db:migrate
npm run db:seed

echo "Starting application..."
npm start
