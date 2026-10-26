import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HeyCounsel | The Independent Counsel Platform & Hive Mind',
  description: 'AI-powered legal knowledge base, co-counsel matching, and community hub for independent lawyers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased text-slate-800 bg-slate-50">
        {children}
      </body>
    </html>
  );
}
