# **WatchHub E-commerce Backend Project**

E-commerce platform for selling watches built as a personal backend project.

Tech Stack & Technologies Used:

- **Backend Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Programming Language:** TypeScript
- **Package Manager:** npm

---

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18+ recommended) - https://nodejs.org/
- NestJS CLI - https://nestjs.com/
- Docker - https://www.docker.com/

---

## Installation

1. Clone the repository:

   git clone <YOUR_PROJECT_URL>
   cd <YOUR_PROJECT_FOLDER>

2. Install all dependencies:

   npm install

---

## Database Setup

1. Start the development database:

   npm run db:dev:up

2. Restart the database if needed:

   npm run db:dev:restart

> Note: Make sure Docker is running before starting the database.

---

## Running the Application

1. Start the application in production mode:

   npm run start

2. Start the application in development mode (with hot reload):

   npm run start:dev

The application will be available at: http://localhost:3000

---

## Project Structure

src/
├─ modules/ # Application modules (users, products, orders, etc.)
├─ prisma/ # Prisma schema and migrations
├─ main.ts # Entry point
└─ ...

---

## Author

Miloš Vidaković
