# Expanders360 — Global Expansion Management API

<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="NestJS Logo" />
  </a>
</p>

## Overview

This is the backend service for Expanders360, a Global Expansion Management platform. It's built with **NestJS**, leveraging **MySQL** for relational data and **MongoDB** for research documents. The service provides a robust API for managing accounts, projects, clients, vendors, and research documents, along with powerful authentication and analytics capabilities.

---

## ✨ Key Features

- **Authentication & Authorization:** Secure user management with JWT-based authentication and role-based authorization.
- **Account Management:** CRUD operations for user accounts with secure password hashing.
- **Project Management:** Create, manage, and track projects, including intelligent vendor matching and status updates.
- **Vendor Management:** Comprehensive vendor profiles, filtering by country and services, and SLA tracking.
- **Research Document Handling:** Upload and search research documents, with support for Excel file processing (MongoDB integration).
- **Dynamic Vendor Matching:** Automatic rebuilding of vendor matches for projects based on predefined criteria.
- **Analytics:** Endpoints to provide insights, such as top-performing vendors per country.
- **Scheduled Tasks:** Daily cron jobs to refresh project matches and flag expired vendor SLAs.
- **Email Notifications:** Automated email notifications for key events, like new match creation.
- **Hybrid Database Support:** Seamless integration of relational data (MySQL) and non-relational document storage (MongoDB).

---

## 🛠 Technologies Used

- **Backend Framework:** [NestJS](https://nestjs.com/)
- **Database (Relational):** [MySQL](https://www.mysql.com/) with [TypeORM](https://typeorm.io/)
- **Database (Document):** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (assuming based on `research-document.schema.ts`)
- **Authentication:** [JWT (JSON Web Tokens)](https://jwt.io/)
- **Password Hashing:** [Bcrypt](https://www.npmjs.com/package/bcrypt)
- **Logging:** [NestJS Logger](https://docs.nestjs.com/techniques/logger)
- **Email Service:** (Details pending implementation, e.g., Nodemailer, SendGrid)
- **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Docker](https://www.docker.com/products/docker-desktop) & [Docker Compose](https://docs.docker.com/compose/install/) (if running with Docker)
- A MySQL database instance (local or remote)
- A MongoDB instance (local or remote)

### ⚙️ Local Development Setup

Follow these steps to get the project running on your local machine:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/your-username/expanders360-assessment.git # Replace with your repo URL
    cd expanders360-assessment
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the project root by copying the example:

    ```bash
    cp .env.example .env
    ```

    Edit the `.env` file and fill in your database credentials and other configuration details (e.g., JWT secret, email service credentials, MongoDB connection string).

4.  **Database Setup (MySQL):**
    - **Create Database:**
      ```bash
      npm run db:create
      ```
    - **Run Migrations:** Apply all pending database migrations.
      ```bash
      npm run db:migrate
      ```
    - **Run Seeders (Optional):** Populate the database with initial data.
      ```bash
      npm run db:seed
      ```

5.  **Start the Server:**
    ```bash
    npm run start:dev # For development with hot-reloading
    # Or npm start # For production build
    ```

The API will be accessible at `http://localhost:3000` (or your configured port).

### 🐳 Running with Docker

For a containerized setup, use Docker Compose:

1.  **Build and Start Services:** This will build the Docker images and start the database services (MySQL, MongoDB) and the NestJS backend.

    ```bash
    docker-compose up --build
    ```

2.  **Stop Services:**
    ```bash
    docker-compose down
    ```

---

## ⏰ Scheduled Jobs & Notifications

- **Daily Project Match Refresh:** A daily cron job (configured with `EVERY_DAY_AT_MIDNIGHT` or similar) is scheduled to automatically refresh vendor matches for all **active** projects. It also identifies and flags vendors whose Service Level Agreements (SLAs) have expired.
- **Email Notifications:** The system sends automated email notifications for significant events, such as the creation of new vendor matches for a project.

---

## 📖 API Documentation (Swagger UI)

Explore the API endpoints and their functionalities using Swagger UI:

- **Local Development:** Once the server is running locally, access the documentation at:
  [http://localhost:8080/api/docs](http://localhost:8080/api/docs) (Ensure this matches your `main.ts` configuration)
- **Production Deployment:** (If applicable)
  [https://app-cab0ddf3-af9b-436b-afcd-536d68b73322.cleverapps.io/api/docs#/](https://app-cab0ddf3-af9b-436b-afcd-536d68b73322.cleverapps.io/api/docs#/) (Update with actual production URL if it changes)

---

## 🤝 Contributing

(Optional: Add guidelines for how others can contribute to your project, e.g., coding standards, pull request process, issue reporting.)

---

## 📄 License

(Optional: Specify the license under which your project is released, e.g., MIT, Apache 2.0.)
