import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import { Inter } from "next/font/google";
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
  themeColor: "#16a34a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
            <Analytics />
            <RegisterSW />
            <Toaster />
          </NotificationsProvider>
        </WalletProvider>
      </body>
    </html>
  )
}


