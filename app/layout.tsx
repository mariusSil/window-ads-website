import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Metadata moved to locale layout to prevent duplication

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
