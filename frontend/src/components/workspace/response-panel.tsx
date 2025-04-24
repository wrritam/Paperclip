"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function ResponsePanel() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400">
            200 OK
          </Badge>
          <span className="text-sm text-gray-500">127ms</span>
          <span className="text-sm text-gray-500">3.2 KB</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check size={14} className="mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} className="mr-2" />
              Copy
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="pretty">
        <TabsList className="mb-4">
          <TabsTrigger value="pretty">Pretty</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>

        <TabsContent
          value="pretty"
          className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto max-h-[calc(100vh-300px)]"
        >
          <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono">
            {`{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "created_at": "2025-01-15T08:30:00Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user",
      "created_at": "2025-02-20T14:15:00Z"
    },
    {
      "id": 3,
      "name": "Robert Johnson",
      "email": "robert@example.com",
      "role": "user",
      "created_at": "2025-03-10T11:45:00Z"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "per_page": 10
  }
}`}
          </pre>
        </TabsContent>

        <TabsContent value="raw">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto max-h-[calc(100vh-300px)]">
            <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
              {"{"}"users":[{"{"}"id":1,"name":"John
              Doe","email":"john@example.com","role":"admin","created_at":"2025-01-15T08:30:00Z"{"}"},{"{"}
              "id":2,"name":"Jane Smith","email":"jane@example.com","role":"user","created_at":"2025-02-20T14:15:00Z"
              {"}"},{"{"}"id":3,"name":"Robert
              Johnson","email":"robert@example.com","role":"user","created_at":"2025-03-10T11:45:00Z"{"}"}],"meta":
              {"{"}"total":3,"page":1,"per_page":10{"}"}
              {"}"}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="headers">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto max-h-[calc(100vh-300px)]">
            <div className="grid grid-cols-2 gap-y-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Content-Type</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">application/json</div>

              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Cache-Control</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">no-cache, private</div>

              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">X-Request-ID</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">7b92afd5-9436-4e48-a9e7-553f87a8e702</div>

              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Server</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">nginx/1.21.0</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
