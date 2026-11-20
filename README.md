# 🐠 XR Aquarium

The official web platform for the **XR Aquarium** event.

A bilingual platform for managing participants, projects, teams, mentors, schedules, learning resources, announcements, and laboratory equipment.

## ✨ Features

- Participant registration and authentication
- Project discovery and applications
- Team creation and membership management
- Mentor and project management
- Event schedule and announcements
- Learning materials and downloadable resources
- Laboratory equipment requests and management
- Role-based access control
- Persian / English support
- Responsive UI with light and dark themes

## 🛠 Tech Stack

- **Next.js 16** — App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Prisma 5** — ORM
- **SQLite** — Database
- **NextAuth v5** — Authentication
- **next-intl** — Internationalization
- **Framer Motion** — Animations
- **Radix UI** — UI primitives
- **Zustand** — Client state management

## 🌐 Languages

- Persian (`fa`) — default
- English (`en`)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mamad-MD/XR-Aquarium.git
cd XR-Aquarium
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env` from `.env.example` and set the required values.

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Set up the database

```bash
npx prisma db push
```

### 5. Seed the database

```bash
npx tsx scripts/seed.ts
```

### 6. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📁 Project Structure

```text
XR-Aquarium/
├── messages/        # Persian and English translations
├── prisma/          # Database schema and migrations
├── public/          # Static assets and downloadable files
├── scripts/         # Database seed and utility scripts
├── src/
│   ├── app/         # Next.js routes and pages
│   ├── components/  # Reusable UI components
│   ├── i18n/        # Internationalization configuration
│   ├── lib/         # Shared utilities and application data
│   └── types/       # TypeScript types
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

## 🔐 Roles

The platform supports role-based access for:

- `PARTICIPANT`
- `MENTOR`
- `EXECUTIVE`
- `ADMIN`

## 👤 Developer

Made by [Mamad-MD](https://github.com/Mamad-MD)
