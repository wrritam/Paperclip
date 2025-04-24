"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import { PlusCircle, X } from "lucide-react"

export default function RequestForm() {
  const [params, setParams] = useState([{ key: "", value: "", id: "1" }])
  const [headers, setHeaders] = useState([
    { key: "Content-Type", value: "application/json", id: "1" },
    { key: "Accept", value: "application/json", id: "2" },
  ])
  const [bodyType, setBodyType] = useState("json")
  const [jsonBody, setJsonBody] = useState(`{
  "name": "John Doe",
  "email": "john@example.com"
}`)

  const addParam = () => {
    setParams([...params, { key: "", value: "", id: Date.now().toString() }])
  }

  const removeParam = (id: string) => {
    setParams(params.filter((param) => param.id !== id))
  }

  const updateParam = (id: string, field: "key" | "value", value: string) => {
    setParams(params.map((param) => (param.id === id ? { ...param, [field]: value } : param)))
  }

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "", id: Date.now().toString() }])
  }

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id))
  }

  const updateHeader = (id: string, field: "key" | "value", value: string) => {
    setHeaders(headers.map((header) => (header.id === id ? { ...header, [field]: value } : header)))
  }

  return (
    <div className="border-b border-gray-200">
      <Tabs defaultValue="params">
        <TabsList className="px-4 border-b rounded-none justify-start">
          <TabsTrigger value="params" className="data-[state=active]:bg-white">
            Query Params
          </TabsTrigger>
          <TabsTrigger value="headers" className="data-[state=active]:bg-white">
            Headers
          </TabsTrigger>
          <TabsTrigger value="body" className="data-[state=active]:bg-white">
            Body
          </TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="p-4">
          <div className="space-y-2">
            {params.map((param, index) => (
              <div key={param.id} className="grid grid-cols-12 gap-2">
                <Input
                  className="col-span-5"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => updateParam(param.id, "key", e.target.value)}
                />
                <Input
                  className="col-span-5"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => updateParam(param.id, "value", e.target.value)}
                />
                <div className="col-span-2 flex gap-1">
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => removeParam(param.id)}>
                    <X size={16} />
                  </Button>
                  {index === params.length - 1 && (
                    <Button variant="outline" size="icon" className="h-10 w-10" onClick={addParam}>
                      <PlusCircle size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {params.length === 0 && (
              <Button variant="outline" className="gap-2" onClick={addParam}>
                <PlusCircle size={16} />
                Add Parameter
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="headers" className="p-4">
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={header.id} className="grid grid-cols-12 gap-2">
                <Input
                  className="col-span-5"
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) => updateHeader(header.id, "key", e.target.value)}
                />
                <Input
                  className="col-span-5"
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) => updateHeader(header.id, "value", e.target.value)}
                />
                <div className="col-span-2 flex gap-1">
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => removeHeader(header.id)}>
                    <X size={16} />
                  </Button>
                  {index === headers.length - 1 && (
                    <Button variant="outline" size="icon" className="h-10 w-10" onClick={addHeader}>
                      <PlusCircle size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="body" className="p-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={bodyType === "json" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setBodyType("json")}
              >
                JSON
              </Button>
              <Button
                variant={bodyType === "form" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setBodyType("form")}
              >
                Form
              </Button>
              <Button
                variant={bodyType === "text" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setBodyType("text")}
              >
                Text
              </Button>
            </div>

            {bodyType === "json" && (
              <Textarea
                className="font-mono h-48 resize-none"
                value={jsonBody}
                onChange={(e) => setJsonBody(e.target.value)}
              />
            )}

            {bodyType === "form" && (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2">
                  <Input className="col-span-5" placeholder="Key" />
                  <Input className="col-span-5" placeholder="Value" />
                  <div className="col-span-2 flex gap-1">
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <PlusCircle size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {bodyType === "text" && <Textarea className="h-48 resize-none" placeholder="Enter plain text body" />}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
