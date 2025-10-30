# Supabase Setup Guide

Follow these steps to run Dragos against a managed Supabase Postgres database.

1. **Create a Supabase project**
   - Visit https://app.supabase.com and create a new project.
   - Choose a strong database password (you will need this for the connection string).

2. **Retrieve the connection string**
   - In your Supabase project, open *Settings -> Database -> Connection string*.
   - Copy the `URI` for **Node.js** (it already includes `?pgbouncer=true`).
   - Example: `postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres?sslmode=require`.

3. **Local development**
   - Update `.env` with the Supabase URI (use the **pooled** string for `DATABASE_URL`, and optionally the non-pooled string for `DIRECT_URL` if you prefer Prisma to run migrations against a direct connection):
     ```env
     DATABASE_URL="postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres?pgbouncer=true&sslmode=require"
     DIRECT_URL="postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres?sslmode=require"
     ```
   - Regenerate the Prisma client:
     ```bash
     npx prisma generate
     ```
   - Apply migrations to Supabase (the schema has been prepared for Postgres):
     ```bash
     npx prisma migrate deploy
     ```

4. **Vercel deployment**
   - In Vercel -> Project Settings -> Environment Variables, set `DATABASE_URL` to the Supabase URI.
   - Redeploy the project so that the new environment variable is available at runtime.

5. **Optional: Shadow database**
   - When running `prisma migrate dev` locally, Prisma needs a writable database. Either use the main Supabase database or supply a dedicated `SHADOW_DATABASE_URL` pointing to another Postgres database.

6. **Security reminders**
   - Keep your Supabase password/URI secret. Do not commit it to source control.
   - Consider using Supabase Row Level Security (RLS) if you expose the database directly to clients. This app only talks to Supabase through Prisma on the server, so RLS is optional.

Once `DATABASE_URL` points to Supabase, NextAuth and the new chat features will store all data in the hosted Postgres instance.
