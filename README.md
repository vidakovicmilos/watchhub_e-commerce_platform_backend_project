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
- **Docker** – containerization

---

## ⚙️ Prerequisites

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

3. **Create a **``** file** in the root directory with the following environment variables:

   ```env
   DATABASE_URL="postgresql://postgres:123@localhost:5434/nest?schema=public"
   JWT_SECRET="test123dhgwdhgwgdh"

   CLOUDINARY_CLOUD_NAME=dz3xwiwwewe
   CLOUDINARY_API_KEY=6619723
   CLOUDINARY_API_SECRET=bx046

   STRIPE_SECRET_KEY=sk_test_51R
   STRIPE_API_VERSION=2025-09-30.clover
   STRIPE_WEBHOOK_SECRET=whc_g15Taavadq
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
   ngrok http 3000
   ```

8. **Set up Stripe webhook:**

   - Copy your Ngrok public URL.
   - Go to your Stripe Dashboard and create a webhook using the Ngrok URL to handle Stripe events for your project.
   - Make sure to listen for the event `checkout.session.completed` to handle successful payments properly.

---

## ✅ Notes

- Make sure you have valid credentials for Stripe and Cloudinary in your `.env` file.
- All payments and media uploads are handled through Stripe and Cloudinary respectively.
- This setup is for development; production setup may require additional configuration.

