"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { ArrowUpRight, BarChart2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/src/lib/utils"

interface RequestsTableProps {
  searchQuery: string
  filterWithInsights?: boolean
  filterErrors?: boolean
}

const requests = [
  {
    id: "req1",
    name: "Get Users",
    method: "GET",
    url: "/api/users",
    lastRun: "2 hours ago",
    status: 200,
    responseTime: "127ms",
    hasInsights: true,
    insights: 5,
  },
  {
    id: "req2",
    name: "Create User",
    method: "POST",
    url: "/api/users",
    lastRun: "3 hours ago",
    status: 201,
    responseTime: "145ms",
    hasInsights: true,
    insights: 3,
  },
  {
    id: "req3",
    name: "Update User",
    method: "PUT",
    url: "/api/users/1",
    lastRun: "5 hours ago",
    status: 200,
    responseTime: "118ms",
    hasInsights: true,
    insights: 2,
  },
  {
    id: "req4",
    name: "Delete User",
    method: "DELETE",
    url: "/api/users/1",
    lastRun: "1 day ago",
    status: 204,
    responseTime: "95ms",
    hasInsights: false,
    insights: 0,
  },
  {
    id: "req5",
    name: "User Details",
    method: "GET",
    url: "/api/users/1",
    lastRun: "2 days ago",
    status: 200,
    responseTime: "132ms",
    hasInsights: true,
    insights: 4,
  },
  {
    id: "req6",
    name: "Login",
    method: "POST",
    url: "/auth/login",
    lastRun: "3 days ago",
    status: 200,
    responseTime: "210ms",
    hasInsights: true,
    insights: 6,
  },
  {
    id: "req7",
    name: "Register",
    method: "POST",
    url: "/auth/register",
    lastRun: "4 days ago",
    status: 201,
    responseTime: "189ms",
    hasInsights: true,
    insights: 4,
  },
  {
    id: "req8",
    name: "Invalid Endpoint",
    method: "GET",
    url: "/api/invalid",
    lastRun: "5 days ago",
    status: 404,
    responseTime: "87ms",
    hasInsights: false,
    insights: 0,
  },
  {
    id: "req9",
    name: "Server Error",
    method: "POST",
    url: "/api/process",
    lastRun: "1 day ago",
    status: 500,
    responseTime: "320ms",
    hasInsights: true,
    insights: 3,
  },
]

const methodColors = {
  GET: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  POST: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  PATCH: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
}

const statusColors = {
  200: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  201: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  204: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  400: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  404: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  500: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export default function RequestsTable({
  searchQuery,
  filterWithInsights = false,
  filterErrors = false,
}: RequestsTableProps) {
  const filteredRequests = requests.filter((request) => {
    // Apply search filter
    if (
      searchQuery &&
      !request.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.url.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Apply insights filter
    if (filterWithInsights && !request.hasInsights) {
      return false
    }

    // Apply errors filter
    if (filterErrors && request.status < 400) {
      return false
    }

    return true
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response Time</TableHead>
            <TableHead>Insights</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn(methodColors[request.method as keyof typeof methodColors])}>
                    {request.method}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">{request.url}</TableCell>
                <TableCell className="text-sm text-gray-500">{request.lastRun}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn(statusColors[request.status as keyof typeof statusColors])}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>{request.responseTime}</TableCell>
                <TableCell>
                  {request.hasInsights ? (
                    <div className="flex items-center gap-1">
                      <BarChart2 size={14} className="text-primary" />
                      <span>{request.insights}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/workspace?id=${request.id}`}>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ArrowUpRight size={14} />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
