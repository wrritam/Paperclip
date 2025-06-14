import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Azeret_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/global/theme-provider"
import Navbar from "@/components/global/navbar"
import { type ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})
const azeret = Azeret_Mono({ subsets: ["latin"], variable: "--font-azeret" })

export const metadata: Metadata = {
  title: "Paperclip - Modern API Testing Platform",
  description: "Test, analyze, and optimize your APIs with powerful insights and AI-driven suggestions",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${azeret.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
