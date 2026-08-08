# XR Aquarium

XR Aquarium is a production-grade web application for managing XR and interactive environments. 

## Architecture
- **Framework**: Next.js 14 (App Router)
- **Rendering**: Server Components

## Tech Stack
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- SQLite / PostgreSQL
- NextAuth v5 (beta)
- Framer Motion

## Roles & Permissions
The system uses role-based access control with the following levels:
- **PARTICIPANT**
- **MENTOR**
- **EXECUTIVE**
- **ADMIN**

## Local Development Setup

Follow these steps to run the project locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```

3. Sync database schema:
   ```bash
   npx prisma db push
   ```

4. Seed the database with initial data:
   ```bash
   npx tsx scripts/seed.ts
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Seed Data Included
The database seed script provides default users to help you get started:
- `admin@example.com`
- `student@example.com`
- `mentor@example.com`

## Deployment
This project follows the standard Next.js deployment process (e.g., deploying to Vercel or building a Docker container). 

For a production environment, ensure you configure your `.env` to point the `DATABASE_URL` to a production PostgreSQL database.