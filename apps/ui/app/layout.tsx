import Header from '@/components/headers/header'
import { ReactQueryClientProvider } from '@/contexts/ReactQueryClient'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Budgmate : Share bill',
  description: 'Share bill with your friends.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <ReactQueryClientProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <div className="container mx-auto mt-4 px-4">{children}</div>
          </NextIntlClientProvider>
        </body>
      </ReactQueryClientProvider>
    </html>
  )
}
