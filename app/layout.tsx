import type { Metadata, Viewport } from 'next';
import '@fontsource/anton/400.css';
import '@fontsource-variable/inter/index.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sandra Kayirangwa',
  description: 'Software engineer in Kigali building software and data systems, from field sensors to the people who use them.',
};
export const viewport: Viewport = { themeColor: '#0c3b2e', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <noscript><style>{`.landing{display:none}`}</style></noscript>
        {children}
      </body>
    </html>
  );
}
