"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import { Send, Code, BarChart2, Sparkles, Trash2, Save } from "lucide-react"
import ResponsePanel from "@/src/app/workspace/_components/response-panel"
import InsightsPanel from "@/src/app/workspace/_components/insights-panel"
import AIPanel from "@/src/app/workspace/_components/ai-panel"
import RequestForm from "@/src/app/workspace/_components/request-form"
import { useToast } from "@/src/components/ui/use-toast"
import { Sidebar } from "./_components/sidebar"
import { useState } from 'react';
import { HttpMethod } from "./types"

export default function Workspace() {

  const { toast } = useToast()

  const handleDeleteRequest = () => {
    toast({
      title: "Request deleted",
      description: "The request has been deleted successfully",
    })
  }

  const [method, setMethod] = useState<HttpMethod>(HttpMethod.GET);
  const [url, setUrl] = useState<string>('https://api.example.com/users');
  const [queryParams, setQueryParams] = useState<Array<{ id: string; key: string; value: string }>>([]);
  const [headers, setHeaders] = useState<Array<{ id: string; key: string; value: string }>>([]);
  const [requestBody, setRequestBody] = useState<string>('');

  const handleSendRequest = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/run-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method,
          url,
          queryParams,
          headers,
          body: requestBody,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Request successful:', data);

    } catch (error) {
      console.error('Error sending request:', error);
      toast({
        title: "Error sending request",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Request Bar */}
        <div className="p-4 border-b border-zinc-200 flex items-center gap-3">
          {/* Use the enum for the Select component */}
          <Select value={method} onValueChange={(value) => setMethod(value as HttpMethod)}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={HttpMethod.GET}>GET</SelectItem>
              <SelectItem value={HttpMethod.POST}>POST</SelectItem>
              <SelectItem value={HttpMethod.PUT}>PUT</SelectItem>
              <SelectItem value={HttpMethod.DELETE}>DELETE</SelectItem>
              <SelectItem value={HttpMethod.PATCH}>PATCH</SelectItem>
            </SelectContent>
          </Select>

          <Input className="flex-1" placeholder="Enter API URL" value={url} onChange={(e) => setUrl(e.target.value)} />

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleDeleteRequest}>
              <Trash2 size={16} />
              <span className="hidden sm:inline">Delete</span>
            </Button>

            <Button variant="outline" className="gap-2">
              <Save size={16} />
              <span className="hidden sm:inline">Save</span>
            </Button>

            <Button className="gap-2" onClick={handleSendRequest}>
              <Send size={16} />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </div>

        {/* Request Parameters */}
        <RequestForm
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          headers={headers}
          setHeaders={setHeaders}
          requestBody={requestBody}
          setRequestBody={setRequestBody}
        />

        {/* Response Area */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="response" className="h-full flex flex-col">
            <TabsList className="px-4 border-b rounded-none justify-start">
              <TabsTrigger value="response" className="gap-2 data-[state=active]:bg-white">
                <Code size={16} />
                <span>Response</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2 data-[state=active]:bg-white">
                <BarChart2 size={16} />
                <span>Insights</span>
                <Badge className="ml-1 bg-primary/10 text-primary">5</Badge>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2 data-[state=active]:bg-white">
                <Sparkles size={16} />
                <span>AI Suggestions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="response" className="flex-1 p-0 overflow-auto data-[state=active]:flex">
              <ResponsePanel />
            </TabsContent>

            <TabsContent value="insights" className="flex-1 p-0 overflow-auto data-[state=active]:flex">
              <InsightsPanel />
            </TabsContent>

            <TabsContent value="ai" className="flex-1 p-0 overflow-auto data-[state=active]:flex">
              <AIPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
