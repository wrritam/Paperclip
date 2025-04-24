import { Button } from "@/src/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-6">
            Modern API Testing with <span className="text-primary">Paperclip</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
            Test, analyze, and optimize your APIs with powerful insights and AI-driven suggestions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="gap-2 px-6 py-6 text-base">
                Get Started
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 px-6 py-6 text-base">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
