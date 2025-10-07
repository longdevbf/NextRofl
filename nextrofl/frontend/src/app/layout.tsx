import type React from "react"
import type { Metadata } from "next"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono" // Removed due to missing module
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Providers } from "@/components/provider/provider"

export const metadata: Metadata = {
  title: "NextRofl",
  description: "Experience the future of blockchain technology with NextRofl",
  generator: 'Thomas',
  icons: {
    icon: "/assets/NFT.jpg",
    shortcut: "/assets/NFT.jpg",
    apple: "/assets/NFT.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-black text-white min-h-screen">
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
