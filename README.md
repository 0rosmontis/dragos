# Dragos Messaging Platform

A secure messaging platform built with Next.js 14, TypeScript, TailwindCSS, Prisma, and NextAuth.js. This project provides a foundation for building privacy-focused communication experiences where users can sign up, authenticate, manage profiles, and exchange messages safely.

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm, npm, or yarn
- PostgreSQL (or another Prisma-supported database)

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file in the project root and define the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dragos"
NEXTAUTH_SECRET="super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret"
```

### Database
Generate the Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Development
```bash
npm run dev
```

The development server runs on [http://localhost:3000](http://localhost:3000).

### Production
```bash
npm run build
npm start
```

## Project Structure
- `app/`: Application routes using the Next.js App Router
- `components/`: Reusable UI, layout, and provider components
- `lib/`: Shared utilities, hooks, and generated Prisma runtime files
- `prisma/`: Database schema and migrations
- `public/`: Static assets
- `scripts/`: Tooling and automation scripts

## License
MIT
