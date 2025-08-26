# Expanders360 Backend

Backend service built with **NestJS**, **MySQL**, and **MongoDB**.  
Provides APIs for authentication, projects, research documents, analytics, and vendors.

---

## Description

This service provides:

- Authentication and authorization with JWT.
- Research document search and Excel upload.
- Project management with vendor match rebuilding.
- Analytics endpoints (e.g., top vendors per country).
- Integration of relational (MySQL) and non-relational (MongoDB) databases.

---

## 🚀 Setup

### Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Create db if not exsist
npm run db:create

npm run db:migrate
# Run migrations

npm run db:migrate

# Run seeds (optional)
npm run db:seed

# Start the server
npm start
```

With Docker

# Build and start services

docker-compose up --build

## 📖 API Documentation (Swagger)

- **Local**: [http://localhost:8080/api/docs](http://localhost:port/api/docs)
- **Production**: [https://app-cab0ddf3-af9b-436b-afcd-536d68b73322.cleverapps.io/api/docs#/](https://app-cab0ddf3-af9b-436b-afcd-536d68b73322.cleverapps.io/api/docs#/)
