set -e

echo "Waiting for database to be ready..."

until nc -z $DATABASE_HOST $DATABASE_PORT; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up - running migrations & seeds"

npm run db:create || true
npm run db:migrate
npm run db:seed

echo "Starting application..."
npm star