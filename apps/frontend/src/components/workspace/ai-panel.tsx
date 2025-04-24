"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Sparkles, Code, AlertCircle, Lightbulb, Copy, Check, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Badge } from "@/src/components/ui/badge"

// Mock data based on the provided AI suggestions implementation
const mockAiSuggestions = {
  summary:
    "This API endpoint shows good performance with a 5% error rate and acceptable response times averaging 127ms.",
  tips: [
    {
      title: "Optimize Query Parameters",
      description:
        "Consider adding pagination parameters (page, limit) to improve response time and reduce data transfer.",
      codeSnippet: null,
      type: "optimization",
    },
    {
      title: "Add Response Caching",
      description:
        "Implement caching headers to reduce server load and improve response times for frequently accessed resources.",
      codeSnippet: `// Example cache-control header
Cache-Control: max-age=3600, public`,
      type: "optimization",
    },
    {
      title: "Security: Add Authentication",
      description:
        "This API endpoint doesn't use authentication. Consider adding an Authorization header with a token for secure access.",
      codeSnippet: null,
      type: "security",
    },
    {
      title: "Implement Rate Limiting",
      description: "Add rate limiting to protect your API from abuse and ensure fair usage across clients.",
      codeSnippet: `// Example rate limiting headers
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1618884730`,
      type: "security",
    },
    {
      title: "Use Compression",
      description: "Enable gzip or brotli compression to reduce payload size and improve transfer speeds.",
      codeSnippet: `// Example compression implementation with Express
const compression = require('compression');
app.use(compression());`,
      type: "optimization",
    },
  ],
}

export default function AIPanel() {
  const [copied, setCopied] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refreshing AI suggestions
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const tipTypes = {
    optimization: {
      icon: Lightbulb,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-100 dark:border-amber-900",
    },
    security: {
      icon: AlertCircle,
      color: "text-red-500 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-100 dark:border-red-900",
    },
    code: {
      icon: Code,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-100 dark:border-blue-900",
    },
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">AI Suggestions</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <Card className="border-primary/10">
        <CardHeader className="pb-2 bg-primary/5 rounded-t-lg">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            API Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">{mockAiSuggestions.summary}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Suggestions</TabsTrigger>
          <TabsTrigger value="optimization">
            Optimization
            <Badge
              variant="secondary"
              className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            >
              {mockAiSuggestions.tips.filter((tip) => tip.type === "optimization").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="security">
            Security
            <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
              {mockAiSuggestions.tips.filter((tip) => tip.type === "security").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[400px] pr-4">
          <TabsContent value="all" className="space-y-4 mt-0">
            {mockAiSuggestions.tips.map((tip, index) => {
              const { icon: Icon, color, bg, border } = tipTypes[tip.type as keyof typeof tipTypes]
              return (
                <Card key={index} className={`${border} overflow-hidden`}>
                  <CardHeader className={`pb-2 ${bg}`}>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon size={16} className={color} />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{tip.description}</p>
                    {tip.codeSnippet && (
                      <div className="relative">
                        <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto">
                          {tip.codeSnippet}
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 h-6 w-6 bg-gray-700 hover:bg-gray-600"
                          onClick={() => handleCopy(`tip-${index}`, tip.codeSnippet || "")}
                        >
                          {copied === `tip-${index}` ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} className="text-gray-300" />
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4 mt-0">
            {mockAiSuggestions.tips
              .filter((tip) => tip.type === "optimization")
              .map((tip, index) => {
                const { icon: Icon, color, bg, border } = tipTypes.optimization
                return (
                  <Card key={index} className={`${border} overflow-hidden`}>
                    <CardHeader className={`pb-2 ${bg}`}>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon size={16} className={color} />
                        {tip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{tip.description}</p>
                      {tip.codeSnippet && (
                        <div className="relative">
                          <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto">
                            {tip.codeSnippet}
                          </pre>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-6 w-6 bg-gray-700 hover:bg-gray-600"
                            onClick={() => handleCopy(`opt-${index}`, tip.codeSnippet || "")}
                          >
                            {copied === `opt-${index}` ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} className="text-gray-300" />
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-0">
            {mockAiSuggestions.tips
              .filter((tip) => tip.type === "security")
              .map((tip, index) => {
                const { icon: Icon, color, bg, border } = tipTypes.security
                return (
                  <Card key={index} className={`${border} overflow-hidden`}>
                    <CardHeader className={`pb-2 ${bg}`}>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon size={16} className={color} />
                        {tip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{tip.description}</p>
                      {tip.codeSnippet && (
                        <div className="relative">
                          <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto">
                            {tip.codeSnippet}
                          </pre>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-6 w-6 bg-gray-700 hover:bg-gray-600"
                            onClick={() => handleCopy(`sec-${index}`, tip.codeSnippet || "")}
                          >
                            {copied === `sec-${index}` ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} className="text-gray-300" />
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
