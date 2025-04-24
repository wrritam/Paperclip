import type React from "react"
import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/src/components/theme-provider"
import { Toaster } from "@/src/components/ui/toaster"
import Navbar from "@/src/components/navbar"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})

export const metadata: Metadata = {
  title: "Paperclip - Modern API Testing Platform",
  description: "Test, analyze, and optimize your APIs with powerful insights and AI-driven suggestions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
