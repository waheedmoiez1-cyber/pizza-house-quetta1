import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';
import { getSettings } from '@/lib/db';
import AnnouncementBar from '@/components/AnnouncementBar';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    title: `${settings.storeName} | ${settings.tagline}`,
    description: `Order fresh hand-tossed pizzas, crispy zinger burgers, shawarma wraps & broast online from ${settings.storeName} on Toghi Road, Quetta. Fast delivery!`,
    keywords: 'Pizza House Quetta, Pizza Quetta, Toghi Road Pizza, Zinger Burger Quetta, Shawarma Quetta, Fast Food Quetta',
    openGraph: {
      title: `${settings.storeName} - ${settings.tagline}`,
      description: 'Hand-tossed golden crusts & 100% real mozzarella cheese in Quetta!',
      images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop'],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();

  const themeInitializerScript = `
    (function() {
      try {
        var saved = localStorage.getItem('phq_theme');
        var theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
      </head>
      <body className="font-sans bg-[var(--color-dark)] text-[var(--color-text-primary)] selection:bg-[#C8102E] selection:text-white min-h-screen flex flex-col justify-between antialiased transition-colors duration-300">
        <ClientLayoutWrapper settings={settings}>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
