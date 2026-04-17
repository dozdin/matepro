import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemedToaster } from '@/components/themed-toaster'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'MatePro | Organitza, controla, flueix.',
  description:
    "Sistema de gestió de projectes i tasques. Organiza, controla, fluye. Control total de producció, equips i comunicació.",
  keywords: ['gestió', 'projectes', 'tasques', 'producció'],
  authors: [{ name: 'MatePro' }],
  generator: 'Next.js',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f7fa' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1f35' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const themeInitScript = `
(function(){try{
  var t=localStorage.getItem('theme')||'dark';
  var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;
  var e=document.documentElement;
  e.classList.remove('light','dark');
  e.classList.add(r);
  e.style.colorScheme=r;
}catch(_){}})();`

  return (
    <html lang="ca" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider defaultTheme="dark">
          {children}
          <ThemedToaster />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
