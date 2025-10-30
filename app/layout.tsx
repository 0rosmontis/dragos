import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/components/providers/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dragos Messaging Platform',
  description: 'Secure anonymous messaging built with Next.js 14, Prisma, and NextAuth.js.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
