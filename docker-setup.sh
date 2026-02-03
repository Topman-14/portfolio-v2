#!/bin/bash

set -e

echo "🚀 Setting up Docker development environment..."

echo "📦 Starting Docker containers..."
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🔄 Running database migrations..."
docker-compose exec -T app npx prisma migrate dev --name init

echo "🔧 Generating Prisma client..."
docker-compose exec -T app npx prisma generate

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Create a super admin user: docker-compose exec app npm run createsuperuser"
echo "  2. (Optional) Seed the database: docker-compose exec app npm run seed"
echo "  3. Visit http://localhost:3000"
echo ""
echo "📊 View logs: docker-compose logs -f app"
