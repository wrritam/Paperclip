'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

type Props = {
  responseData: any;
  isLoading: boolean;
}

export const ResponsePanel = ({ responseData, isLoading }: Props) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (responseData) {
      navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (responseData === null) {
    return (
      <div className="p-6 w-full flex items-center justify-center h-full text-zinc-500">
        Send a request to see the response.
      </div>
    );
  }

  const prettyPrintedData = JSON.stringify(responseData, null, 2);
  const rawData = JSON.stringify(responseData);

  return (
    <div className="p-6 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400"
          >
            200 OK
          </Badge>
          <span className="text-sm text-zinc-500">--ms</span>
          <span className="text-sm text-zinc-500">-- KB</span>
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
          className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-auto max-h-[calc(100vh-300px)]"
        >
          <pre className="text-sm text-zinc-600 dark:text-zinc-200 font-mono font-normal tracking-tight">
            {prettyPrintedData}
          </pre>
        </TabsContent>

        <TabsContent value="raw">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-md overflow-auto max-h-[calc(100vh-300px)]">
            <pre className="text-sm text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap">
              {rawData}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="headers">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-md overflow-auto max-h-[calc(100vh-300px)]">
            {/* Headers tab content - currently static, needs to be dynamic */}
            <div className="grid grid-cols-2 gap-y-3">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Content-Type
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                application/json
              </div>

              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Cache-Control
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                no-cache, private
              </div>

              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                X-Request-ID
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                7b92afd5-9436-4e48-a9e7-553f87a8e702
              </div>

              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Server
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                nginx/1.21.0
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
