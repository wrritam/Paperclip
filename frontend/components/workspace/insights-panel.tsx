"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Clock, AlertTriangle, TrendingUp, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data based on the provided insight data structure
const mockInsightData = {
  avgResponseTime: 127,
  errorRate: 0.05,
  slowestResponse: 320,
  avgPayloadSizeKB: 3.2,
  statusCodeDistribution: {
    "200": 42,
    "201": 15,
    "404": 2,
    "500": 1,
  },
  mostCommonHeaders: [
    { name: "Content-Type", value: "application/json", count: 60 },
    { name: "Authorization", value: "Bearer token", count: 55 },
    { name: "Accept", value: "application/json", count: 50 },
  ],
  recentOutputs: [
    { id: "out1", status: 200, time: 127, size: 3.2, timestamp: "2023-04-18T14:30:00Z" },
    { id: "out2", status: 200, time: 135, size: 2.9, timestamp: "2023-04-18T14:25:00Z" },
    { id: "out3", status: 201, time: 142, size: 3.5, timestamp: "2023-04-18T14:20:00Z" },
    { id: "out4", status: 404, time: 87, size: 1.2, timestamp: "2023-04-18T14:15:00Z" },
    { id: "out5", status: 500, time: 320, size: 2.1, timestamp: "2023-04-18T14:10:00Z" },
  ],
  score: 85,
}

const statusColors = {
  "200": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "201": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "204": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "400": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "404": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "500": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export default function InsightsPanel() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">API Performance Insights</h2>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          Score: {mockInsightData.score}/100
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="status">Status Codes</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="recent">Recent Outputs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average</span>
                    <span className="text-sm font-medium">{mockInsightData.avgResponseTime}ms</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  <div className="text-xs text-gray-500">Faster than 70% of your requests</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Slowest</span>
                    <span className="text-sm font-medium">{mockInsightData.slowestResponse}ms</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle size={16} className="text-primary" />
                  Error Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
                    <span className="text-sm font-medium">{(mockInsightData.errorRate * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={mockInsightData.errorRate * 100} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {mockInsightData.errorRate === 0
                      ? "No errors detected in recent requests"
                      : `${Object.entries(mockInsightData.statusCodeDistribution)
                          .filter(([code]) => Number.parseInt(code) >= 400)
                          .reduce((sum, [_, count]) => sum + count, 0)} error responses`}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Payload Size</span>
                    <span className="text-sm font-medium">{mockInsightData.avgPayloadSizeKB} KB</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <div className="text-xs text-gray-500">Average size across all requests</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Response Time Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-36 flex items-end gap-1">
                {mockInsightData.recentOutputs.map((output, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary/80 rounded-t"
                      style={{ height: `${(output.time / mockInsightData.slowestResponse) * 100}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{output.time}ms</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 size={16} className="text-primary" />
                Status Code Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockInsightData.statusCodeDistribution).map(([code, count]) => (
                  <div key={code} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={statusColors[code as keyof typeof statusColors] || "bg-gray-100 text-gray-700"}
                        >
                          {code}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {code === "200"
                            ? "OK"
                            : code === "201"
                              ? "Created"
                              : code === "404"
                                ? "Not Found"
                                : code === "500"
                                  ? "Server Error"
                                  : ""}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{count} requests</span>
                    </div>
                    <Progress
                      value={
                        (count / Object.values(mockInsightData.statusCodeDistribution).reduce((a, b) => a + b, 0)) * 100
                      }
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headers">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Most Common Headers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInsightData.mostCommonHeaders.map((header, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{header.name}</span>
                      <span className="text-xs text-gray-500">{header.count} requests</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                      {header.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Recent Outputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {mockInsightData.recentOutputs.map((output) => (
                    <div key={output.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className={
                            statusColors[output.status.toString() as keyof typeof statusColors] ||
                            "bg-gray-100 text-gray-700"
                          }
                        >
                          {output.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(output.timestamp)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-500">Response time:</div>
                        <div className="font-medium">{output.time}ms</div>
                        <div className="text-gray-500">Payload size:</div>
                        <div className="font-medium">{output.size} KB</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
