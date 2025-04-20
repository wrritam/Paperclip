import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const activities = [
  {
    id: 1,
    user: "JS",
    action: "sent",
    request: "Get Users",
    method: "GET",
    status: 200,
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "JS",
    action: "created",
    request: "New Endpoint",
    method: "POST",
    time: "3 hours ago",
  },
  {
    id: 3,
    user: "JS",
    action: "sent",
    request: "Create User",
    method: "POST",
    status: 201,
    time: "3 hours ago",
  },
  {
    id: 4,
    user: "JS",
    action: "deleted",
    request: "Old Endpoint",
    time: "5 hours ago",
  },
  {
    id: 5,
    user: "JS",
    action: "sent",
    request: "Invalid Endpoint",
    method: "GET",
    status: 404,
    time: "1 day ago",
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

export default function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">{activity.user}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">You</span> {activity.action}{" "}
              <span className="font-medium">{activity.request}</span>
              {activity.method && (
                <>
                  {" "}
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", methodColors[activity.method as keyof typeof methodColors])}
                  >
                    {activity.method}
                  </Badge>
                </>
              )}
              {activity.status && (
                <>
                  {" "}
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", statusColors[activity.status as keyof typeof statusColors])}
                  >
                    {activity.status}
                  </Badge>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
