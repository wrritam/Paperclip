"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RequestListProps {
  activeRequest: string
  setActiveRequest: (id: string) => void
}

const requests = [
  { id: "req1", name: "Get Users", method: "GET", url: "/api/users" },
  { id: "req2", name: "Create User", method: "POST", url: "/api/users" },
  { id: "req3", name: "Update User", method: "PUT", url: "/api/users/1" },
  { id: "req4", name: "Delete User", method: "DELETE", url: "/api/users/1" },
  { id: "req5", name: "User Details", method: "GET", url: "/api/users/1" },
]

const methodColors = {
  GET: "bg-blue-100 text-blue-700",
  POST: "bg-green-100 text-green-700",
  PUT: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
  PATCH: "bg-purple-100 text-purple-700",
}

export default function RequestList({ activeRequest, setActiveRequest }: RequestListProps) {
  return (
    <div className="py-2">
      {requests.map((request) => (
        <div
          key={request.id}
          className={cn(
            "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md mx-1 group",
            activeRequest === request.id && "bg-gray-100",
          )}
          onClick={() => setActiveRequest(request.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded font-medium",
                  methodColors[request.method as keyof typeof methodColors],
                )}
              >
                {request.method}
              </span>
              <span className="text-sm font-medium text-gray-700 truncate">{request.name}</span>
            </div>
            <div className="text-xs text-gray-500 truncate mt-0.5">{request.url}</div>
          </div>
          <ChevronRight
            size={16}
            className={cn(
              "text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity",
              activeRequest === request.id && "opacity-100",
            )}
          />
        </div>
      ))}
    </div>
  )
}
