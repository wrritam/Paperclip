"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SignOutButton } from "@/app/auth/sign-out/sign-out-button"

export default function Navbar() {
  const pathname = usePathname()

  const isAuthPage = pathname.includes("/auth")

  return (
    <header className="border-b border-zinc-200/70 dark:border-zinc-700/30 bg-zinc-200/80 dark:bg-zinc-950">
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
                "text-zinc-700 dark:text-zinc-300",
                pathname === "/dashboard" && "bg-zinc-100 dark:bg-zinc-800",
              )}
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/workspace">
            <Button
              variant="ghost"
              className={cn(
                "text-zinc-700 dark:text-zinc-300",
                pathname === "/workspace" && "bg-zinc-100 dark:bg-zinc-800",
              )}
            >
              Workspace
            </Button>
          </Link>

          {/* Conditional rendering for SignOutButton */}
          {!isAuthPage && <SignOutButton />}
        </nav>
      </div>
    </header>
  )
}
