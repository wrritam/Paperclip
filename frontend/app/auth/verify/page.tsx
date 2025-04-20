"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { toast } = useToast()

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false)
        setError("Invalid verification link")
        return
      }

      try {
        const response = await fetch("/auth/verify-registration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Verification failed")
        }

        setIsVerified(true)
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully",
        })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Verification failed")
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: error instanceof Error ? error.message : "Please try again later",
        })
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token, toast])

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>Verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-center text-sm text-gray-500">Verifying your email address...</p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Email verified successfully</h3>
                <p className="text-sm text-gray-500">
                  Your email has been verified. You can now log in to your account.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Verification failed</h3>
                <p className="text-sm text-gray-500">{error || "The verification link is invalid or has expired."}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">{isVerified ? "Sign in" : "Back to login"}</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
