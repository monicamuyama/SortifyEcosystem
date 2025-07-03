import type { Metadata, Viewport } from 'next';
import { Inter } from "next/font/google";
import { Suspense } from 'react';
import './globals.css';
//import { Providers } from './providers';
import { WalletProvider } from "@/components/providers/wallet-provider"
import { NotificationsProvider } from "@/components/providers/notifications-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Analytics } from "@/components/analytics"
import { RegisterSW } from "./register-sw"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sortify | Smart Waste Management",
  description: "Reward-based waste management platform using blockchain technology",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sortify",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sortify.app",
    title: "Sortify | Smart Waste Management",
    description: "AI-powered waste management with blockchain rewards",
    siteName: "Sortify",
  },
  generator: "v0.dev",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#16a34a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <NotificationsProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
            <RegisterSW />
            <Toaster />
          </NotificationsProvider>
        </WalletProvider>
      </body>
    </html>
  )
}


