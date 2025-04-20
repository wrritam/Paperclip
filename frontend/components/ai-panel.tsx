"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Code, AlertCircle, Lightbulb, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function AIPanel() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <Lightbulb size={20} className="text-amber-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800 mb-1">Optimize Query Parameters</h4>
                <p className="text-sm text-gray-600">
                  Consider adding pagination parameters (page, limit) to improve response time and reduce data transfer.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Code size={20} className="text-blue-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800 mb-1">Code Snippet: Fetch with Pagination</h4>
                <div className="relative">
                  <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto">
                    {`// JavaScript fetch with pagination
const fetchUsers = async (page = 1, limit = 10) => {
  const response = await fetch(
    \`https://api.example.com/users?page=\${page}&limit=\${limit}\`
  );
  return response.json();
};`}
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-6 w-6 bg-gray-700 hover:bg-gray-600"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} className="text-gray-300" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle size={20} className="text-red-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800 mb-1">Security Recommendation</h4>
                <p className="text-sm text-gray-600">
                  This API endpoint doesn't use authentication. Consider adding an Authorization header with a token for
                  secure access.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles size={18} className="text-purple-500" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Based on the response structure and headers, this appears to be a RESTful API following standard
              conventions. Here's what I've detected:
            </p>

            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li>The endpoint returns a collection of user resources with pagination metadata</li>
              <li>Response time is consistent across multiple requests</li>
              <li>The API uses standard HTTP status codes and content types</li>
              <li>No rate limiting headers were detected</li>
            </ul>

            <div className="pt-2">
              <Button className="w-full gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200">
                <Sparkles size={16} />
                <span>Generate API Documentation</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
