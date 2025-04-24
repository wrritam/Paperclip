import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"

export default function ResponsePanel() {
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Response</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-green-600 bg-green-50">
              200 OK
            </Badge>
            <span className="text-sm text-gray-500">127ms</span>
            <span className="text-sm text-gray-500">3.2 KB</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pretty">
          <TabsList className="mb-2">
            <TabsTrigger value="pretty">Pretty</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          <TabsContent value="pretty" className="p-3 bg-gray-50 rounded-md overflow-auto max-h-[500px]">
            <pre className="text-sm text-gray-800 font-mono">
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
            <div className="p-3 bg-gray-50 rounded-md overflow-auto max-h-[500px]">
              <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
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
            <div className="p-3 bg-gray-50 rounded-md overflow-auto max-h-[500px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium text-gray-700">Content-Type</div>
                <div className="text-sm text-gray-600">application/json</div>

                <div className="text-sm font-medium text-gray-700">Cache-Control</div>
                <div className="text-sm text-gray-600">no-cache, private</div>

                <div className="text-sm font-medium text-gray-700">X-Request-ID</div>
                <div className="text-sm text-gray-600">7b92afd5-9436-4e48-a9e7-553f87a8e702</div>

                <div className="text-sm font-medium text-gray-700">Server</div>
                <div className="text-sm text-gray-600">nginx/1.21.0</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
