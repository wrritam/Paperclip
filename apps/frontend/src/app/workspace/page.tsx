"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, Code, BarChart2, Sparkles, Trash2, Save, Loader2 } from "lucide-react"
import { ResponsePanel } from "@/app/workspace/_components/response-panel"
import { InsightsPanel } from "@/app/workspace/_components/insights-panel"
import { AIPanel } from "@/app/workspace/_components/ai-panel"
import { RequestForm } from "@/app/workspace/_components/request-form"
import { Sidebar } from "./_components/sidebar"
import { useState } from 'react';
import { AiAnalysis, ApiInsight, HttpMethod } from "./types"
import { RunRequest } from "./actions/request-actions"
import useToast from "@/hooks/use-toast"

export default function Workspace() {

  const { showToast } = useToast()

  const handleDeleteRequest = () => {
    setMethod(HttpMethod.GET);
    setUrl('https://jsonplaceholder.typicode.com/todos');
    setQueryParams([]);
    setHeaders([]);
    setRequestBody('');
    setResponseData(null);
    setAIAnalysis(undefined);
    setInsights(undefined);
    setIsLoading(false);

    showToast({
      message: "Request deleted",
      description: "All request data has been cleared successfully",
      type: "success"
    })
  }

  const [method, setMethod] = useState<HttpMethod>(HttpMethod.GET);
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/todos');
  const [queryParams, setQueryParams] = useState<Array<{ id: string; key: string; value: string }>>([]);
  const [headers, setHeaders] = useState<Array<{ id: string; key: string; value: string }>>([]);
  const [requestBody, setRequestBody] = useState<string>('');
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiAnalysis, setAIAnalysis] = useState<AiAnalysis | undefined>(undefined);
  const [insights, setInsights] = useState<ApiInsight | null | undefined>(undefined)

  const handleSendRequest = async () => {
    setIsLoading(true);

    const result = await RunRequest({
      method,
      url,
      queryParams,
      headers,
      body: requestBody,
    });

    console.log("first", result);

    if (result.success) {
      setResponseData(result.data);
      setAIAnalysis(result.aiAnalysis);
      setInsights(result.insight)
    } else {
      setResponseData(null);
      setAIAnalysis(undefined);
      showToast({
        message: "Error sending request",
        description: result.error || 'An unknown error occurred',
        type: "error",
      });
    }

    setIsLoading(false);
  };

  console.log("workspace", aiAnalysis)

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Request Bar */}
        <div className="p-4 border-b border-zinc-200 flex items-center gap-3">
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

            <Button
              className="gap-2"
              onClick={handleSendRequest}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              <span className="hidden sm:inline">
                {isLoading ? "Sending..." : "Send"}
              </span>
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
              <ResponsePanel responseData={responseData} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="insights" className="flex-1 p-0 overflow-auto data-[state=active]:flex">
              <InsightsPanel insights={insights} isLoading={isLoading}/>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 p-0 overflow-auto data-[state=active]:flex">
              <AIPanel aiAnalysis={aiAnalysis} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
