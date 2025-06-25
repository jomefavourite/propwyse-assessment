import type React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User',
  description:
    'A Next.js frontend for managing users with full CRUD operations',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
