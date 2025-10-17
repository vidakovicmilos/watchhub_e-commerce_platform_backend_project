# WatchHub E-commerce Backend Project

## 📌 Overview

This is the backend for the WatchHub E-commerce platform. The project is built with modern technologies to handle products, purchases, user management, reviews, and payment processing using Stripe.

### 🔗 API Documentation

You can view the Postman API documentation here: [WatchHub API Documentation](https://documenter.getpostman.com/view/46623470/2sB3QMMVTW)

---

## 🔧 Technologies Used

- **Node.js & TypeScript**
- **NestJS** – framework for building scalable server-side applications
- **Prisma** – ORM for database management
- **PostgreSQL** – relational database
- **Stripe** – payment gateway
- **Cloudinary** – image and media management
- **Mailtrap** – testing email service
- **Docker** – containerization

---

## 🔧 Prerequisites

Before cloning the project, make sure you have the following installed on your system:

1. [Docker](https://www.docker.com/)
2. [Node.js](https://nodejs.org/) and npm
3. NestJS CLI:
   ```bash
   npm install -g @nestjs/cli
   ```
4. Prisma CLI:
   ```bash
   npm install -g prisma
   ```
5. [Ngrok](https://ngrok.com/) – for exposing local servers to the internet
6. [Stripe account](https://stripe.com/)
7. [Cloudinary account](https://cloudinary.com/)
8. [Mailtrap account](https://mailtrap.io/) – for testing emails in development

---

## 💾 Project Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vidakovicmilos/watchhub_e-commerce_platform_backend_project.git
   cd watchhub_e-commerce_platform_backend_project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory with the following environment variables:

   ```env
   DATABASE_URL="postgresql://postgres:123@localhost:5434/nest?schema=public"
   JWT_SECRET="test123dhgwdhgwgdh"

   CLOUDINARY_CLOUD_NAME=dz3xwiwwewe
   CLOUDINARY_API_KEY=6619723
   CLOUDINARY_API_SECRET=bx046

   STRIPE_SECRET_KEY=sk_test_51R
   STRIPE_API_VERSION=2025-09-30.clover
   STRIPE_WEBHOOK_SECRET=whc_g15Taavadq

   MAILTRAP_HOST=sandbox.smtp.mailtrap.io
   MAILTRAP_PORT=2525
   MAILTRAP_USER=989fdc90184723213d9
   MAILTRAP_PASSWORD=71314f3a4c023213
   ```

4. **Set up the database:** Make sure your PostgreSQL server is running and accessible via the URL specified in `DATABASE_URL`.

5. **Run database migrations:**

   ```bash
   npx prisma migrate deploy
   ```

6. **Start the development server:**

   ```bash
   npm run start:dev
   ```

7. **Expose your local server via Ngrok** if you need to test webhooks from Stripe:

   ```bash
   npm run start
   ```

8. The application will be available at: [http://localhost:3333/api](http://localhost:3333/api)

---

## 📄 License

This project is completely free to use for **learning and practice purposes**.  
You are welcome to use, modify, and experiment with the code without any restrictions, as long as it is not used for commercial purposes without proper authorization.

---

## Author

Miloš Vidaković
