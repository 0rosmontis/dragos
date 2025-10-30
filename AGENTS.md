# 🧠 AGENTS.md

## Project Overview
This repository contains a **Next.js 14** full-stack web application built using **TypeScript**, **TailwindCSS**, and **Prisma ORM**.  
The app serves as a **secure messaging platform** that allows users to:
- Create and authenticate accounts (via **NextAuth.js**)
- Send and receive messages (including anonymous ones)
- Manage personal dashboards and profiles
- Validate human interaction using CAPTCHA verification

The project emphasizes modular design, strong typing, and clear separation of concerns between frontend, backend, and database layers.

---

## 🏗️ Core Technologies
| Layer | Tech Stack |
|-------|-------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + PostCSS |
| Database | Prisma ORM |
| Auth | NextAuth.js |
| Build Tools | Node.js / Vercel |
| Deployment | SSR + SSG |

---

## 📂 File Structure
.
├── app
│ ├── (auth)
│ │ ├── sign-in
│ │ └── sign-up
│ ├── api
│ │ └── auth
│ │ └── [...nextauth]
│ ├── me
│ └── send-message
│
├── components
│ ├── actions
│ ├── captcha
│ │ └── hooks
│ ├── home
│ ├── navigation
│ ├── providers
│ ├── ui
│ └── wrappers
│
├── lib
│ ├── generated
│ │ └── prisma
│ │ └── runtime
│ └── hooks
│
├── prisma
│ └── schema.prisma
│
├── public
│ ├── favicon.ico
│ ├── logo.png
│ └── other assets
│
├── scripts
│ └── migrate.js
│
├── .env
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md


---

## ⚙️ Behavior and Responsibilities for AI Agents

**Agents should:**
1. Follow the structure and conventions defined above.
2. Maintain compatibility with:
   - Next.js 14 App Router
   - NextAuth.js authentication flows
   - Prisma database schema and migrations
3. Use TailwindCSS for all styling; avoid inline styles unless necessary.
4. Ensure TypeScript type safety at all times.
5. Respect the existing file hierarchy—don’t create random folders for new logic.
6. Use meaningful commits and concise PR titles (e.g., `feat(auth): add session refresh endpoint`).

**Agents must not:**
- Modify `node_modules`, `.next`, or generated Prisma files manually.
- Hardcode environment variables (use `.env` instead).
- Introduce dependencies without justification.
- Touch the `public/` folder unless adding approved static assets.

---

## 🧩 Example Tasks
| Task | Expected Behavior |
|------|--------------------|
| Add password reset | Extend `/api/auth/[...nextauth]` and create a `reset-password` page under `(auth)` |
| Add profile customization | Extend `/me` route and update related Prisma schema |
| Add message replies | Create a new `replies` model in Prisma, and expand `/send-message` |
| Add email verification | Hook into NextAuth events and add verification logic under `lib/hooks` |

---

## 🧰 Commands & Scripts
| Command | Description |
|----------|-------------|
| `npm run dev` | Run the dev server |
| `npm run build` | Build for production |
| `npx prisma migrate dev` | Apply database migrations |
| `npx prisma studio` | Open Prisma visual editor |

---

## 🧾 Environment Variables
| Variable | Description |
|-----------|--------------|
| `DATABASE_URL` | Connection string for Prisma |
| `NEXTAUTH_SECRET` | Secret key for NextAuth |
| `NEXTAUTH_URL` | Base URL for callbacks |
| `RECAPTCHA_SECRET_KEY` | Key for captcha validation |

---

## 🧑‍💻 AI Development Guidelines
- Prefer functional components and React hooks.
- Reuse existing components before creating new ones.
- Document complex logic with JSDoc-style comments.
- Write modular, clean commits (`feat:`, `fix:`, `refactor:`).
- Respect ESLint and Prettier configuration if present.

---

## 🪶 Summary
This app is the backbone of a privacy-friendly, modern communication platform.  
All changes must preserve security, maintainability, and consistency across UI, API, and database layers.  
The repository is optimized for collaborative human–AI development, so **agents are expected to act as reliable contributors, not code generators.**
