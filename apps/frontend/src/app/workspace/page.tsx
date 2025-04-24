"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Badge } from "@/src/components/ui/badge"
import { PlusCircle, Send, Code, BarChart2, Sparkles, Trash2, Save, FolderPlus } from "lucide-react"
import RequestList from "@/src/components/workspace/request-list"
import ResponsePanel from "@/src/components/workspace/response-panel"
import InsightsPanel from "@/src/components/workspace/insights-panel"
import AIPanel from "@/src/components/workspace/ai-panel"
import RequestForm from "@/src/components/workspace/request-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { useToast } from "@/src/components/ui/use-toast"

export default function Workspace() {
  const [activeRequest, setActiveRequest] = useState("req1")
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false)
  const [newRequestName, setNewRequestName] = useState("")
  const [newRequestMethod, setNewRequestMethod] = useState("GET")
  const { toast } = useToast()

  const handleCreateRequest = () => {
    if (!newRequestName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a request name",
        variant: "destructive",
      })
      return
    }

    // Here you would normally create the request in your backend
    toast({
      title: "Request created",
      description: `Created new ${newRequestMethod} request: ${newRequestName}`,
    })

    setShowNewRequestDialog(false)
    setNewRequestName("")
  }

  const handleDeleteRequest = () => {
    // Here you would normally delete the request from your backend
    toast({
      title: "Request deleted",
      description: "The request has been deleted successfully",
    })
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-200 flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <h2 className="font-medium text-gray-800">Requests</h2>
          <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <PlusCircle size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Request</DialogTitle>
                <DialogDescription>Add a new API request to your collection.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Request Name</Label>
                  <Input
                    id="name"
                    placeholder="My API Request"
                    value={newRequestName}
                    onChange={(e) => setNewRequestName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="method">HTTP Method</Label>
                  <Select value={newRequestMethod} onValueChange={setNewRequestMethod}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRequest}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-3 px-4">
          <div className="relative">
            <Input className="pl-8 bg-gray-50 border-gray-200" placeholder="Search requests..." />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <RequestList activeRequest={activeRequest} setActiveRequest={setActiveRequest} />
        </ScrollArea>

        <div className="p-3 border-t border-gray-200">
          <Button variant="outline" className="w-full justify-start gap-2 text-gray-700">
            <FolderPlus size={16} />
            <span>New Collection</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Request Bar */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <Select defaultValue="GET">
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>

          <Input className="flex-1" placeholder="Enter API URL" defaultValue="https://api.example.com/users" />

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleDeleteRequest}>
              <Trash2 size={16} />
              <span className="hidden sm:inline">Delete</span>
            </Button>

            <Button variant="outline" className="gap-2">
              <Save size={16} />
              <span className="hidden sm:inline">Save</span>
            </Button>

            <Button className="gap-2">
              <Send size={16} />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </div>

        {/* Request Parameters */}
        <RequestForm />

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
