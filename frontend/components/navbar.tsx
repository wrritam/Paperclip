"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-950">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          <span className="font-bold text-xl">Paperclip</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className={cn(
                "text-gray-700 dark:text-gray-300",
                pathname === "/dashboard" && "bg-gray-100 dark:bg-gray-800",
              )}
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/workspace">
            <Button
              variant="ghost"
              className={cn(
                "text-gray-700 dark:text-gray-300",
                pathname === "/workspace" && "bg-gray-100 dark:bg-gray-800",
              )}
            >
              Workspace
            </Button>
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
