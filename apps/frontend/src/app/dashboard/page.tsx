"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { BarChart3, Search, Clock, AlertTriangle, TrendingUp, ArrowUpRight, Filter, Plus } from "lucide-react"
import Link from "next/link"
import RequestsTable from "@/src/app/dashboard/_components/requests-table"
import InsightsOverview from "@/src/app/dashboard/_components/insights-overview"
import PerformanceChart from "@/src/app/dashboard/_components/performance-chart"
import StatusDistribution from "@/src/app/dashboard/_components/status-distribution"
import RecentActivity from "@/src/app/dashboard/_components/recent-activity"
import { Badge } from "@/src/components/ui/badge"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Monitor and analyze your API requests</p>
        </div>
        <div className="flex gap-3">
          <Link href="/workspace">
            <Button className="gap-2 text-white">
              <Plus size={16} />
              New Request
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InsightsOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp size={18} className="text-zinc-500" />
              Response Time Trends
            </CardTitle>
            <CardDescription>Average response time over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 size={18} className="text-zinc-500" />
              Status Distribution
            </CardTitle>
            <CardDescription>Response status codes</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusDistribution />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-requests" className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all-requests">All Requests</TabsTrigger>
            <TabsTrigger value="with-insights">
              With Insights
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                24
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="errors">
              Errors
              <Badge variant="secondary" className="ml-2 bg-destructive/10 text-destructive">
                3
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search requests..."
                className="pl-9 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter size={16} />
            </Button>
          </div>
        </div>

        <TabsContent value="all-requests">
          <RequestsTable searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="with-insights">
          <RequestsTable searchQuery={searchQuery} filterWithInsights={true} />
        </TabsContent>

        <TabsContent value="errors">
          <RequestsTable searchQuery={searchQuery} filterErrors={true} />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock size={18} className="text-zinc-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest API requests and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle size={18} className="text-zinc-500" />
              Top Issues
            </CardTitle>
            <CardDescription>Common problems detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <AlertTriangle size={18} className="text-amber-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-zinc-800">High Latency</h4>
                  <p className="text-xs text-zinc-600 mt-1">3 endpoints with response times &gt; 500ms</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
                    View affected endpoints
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertTriangle size={18} className="text-red-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-zinc-800">Authentication Failures</h4>
                  <p className="text-xs text-zinc-600 mt-1">5 failed auth attempts in the last 24 hours</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
                    Review auth logs
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <AlertTriangle size={18} className="text-blue-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-zinc-800">Missing Headers</h4>
                  <p className="text-xs text-zinc-600 mt-1">Content-Type header missing in 2 requests</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
                    Fix headers
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
