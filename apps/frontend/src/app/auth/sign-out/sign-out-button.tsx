"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useTransition } from "react"
import { signOut } from "./actions"

export function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={handleSignOut}
      disabled={isPending}
    >
      <LogOut size={16} />
      <span>{isPending ? "Signing out..." : "Sign Out"}</span>
    </Button>
  )
}
