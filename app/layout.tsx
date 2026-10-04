import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CaneKids | Canecas e Personalizados',
  description: 'Presentes personalizados para transformar momentos em lembranças.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}