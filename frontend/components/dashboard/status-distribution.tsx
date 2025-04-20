"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "200 OK", value: 42, color: "#10b981" },
  { name: "201 Created", value: 15, color: "#3b82f6" },
  { name: "404 Not Found", value: 2, color: "#f59e0b" },
  { name: "500 Server Error", value: 1, color: "#ef4444" },
]

export default function StatusDistribution() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} requests`, "Count"]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e2e8f0",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
