import { Card, CardContent } from "@/src/components/ui/card"
import { Clock, BarChart3, AlertTriangle } from "lucide-react"

export default function InsightsOverview() {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">127ms</div>
              <div className="text-sm text-zinc-500">Avg. Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-zinc-500">Requests with Insights</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-zinc-500">Error Responses</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
