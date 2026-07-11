import type { Metadata } from 'next';
import './globals.css';
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/layout.css';
import '@/styles/components/sidebar.css';
import '@/styles/components/progress.css';
import '@/styles/components/input.css';
import '@/styles/components/filters.css';
import '@/styles/components/tasks.css';
import '@/styles/components/sections.css';
import '@/styles/components/responsive.css';

export const metadata: Metadata = {
  title: 'Todo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
