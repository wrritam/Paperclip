import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { BarChart2, Clock, AlertTriangle, TrendingUp } from "lucide-react"

export default function InsightsPanel() {
  return (
    <div className="space-y-4">
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart2 size={18} className="text-gray-500" />
            Performance Insights
            <span className="text-xs text-gray-500 font-normal ml-2">(Based on 5 requests)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock size={14} className="text-gray-400" />
                  Average Response Time
                </span>
                <span className="text-sm font-medium">127ms</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "30%" }}></div>
              </div>
              <div className="text-xs text-gray-500">Faster than 70% of your requests</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <AlertTriangle size={14} className="text-gray-400" />
                  Error Rate
                </span>
                <span className="text-sm font-medium">0%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "0%" }}></div>
              </div>
              <div className="text-xs text-gray-500">No errors detected in recent requests</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-2">Response Time Trend</h4>
            <div className="h-24 flex items-end gap-1">
              {[120, 135, 118, 142, 127].map((time, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-400 rounded-t" style={{ height: `${(time / 150) * 100}%` }}></div>
                  <div className="text-xs text-gray-500 mt-1">{time}ms</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp size={18} className="text-gray-500" />
            Response Size Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Average Size</span>
                <span className="text-sm font-medium">3.2 KB</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Smallest Response</div>
                <div className="text-sm font-medium">2.8 KB</div>
                <div className="text-xs text-gray-500">Request #3</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Largest Response</div>
                <div className="text-sm font-medium">3.5 KB</div>
                <div className="text-xs text-gray-500">Request #1</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
