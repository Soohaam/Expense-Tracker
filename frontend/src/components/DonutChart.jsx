import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { PieChart as PieIcon } from "lucide-react"

const DonutChart = () => {
  const { categoryBreakdown, summary } = useSelector((state) => state.transactions)

  const COLORS = [
    "#10b981", // emerald
    "#3b82f6", // blue
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
    "#6366f1", // indigo
  ]

  const chartData = categoryBreakdown
    .filter((item) => item.type === "expense")
    .map((item, index) => ({
      name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      value: item.total,
      color: COLORS[index % COLORS.length],
    }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percent = ((payload[0].value / summary.expense) * 100).toFixed(1)
      return (
        <div className="bg-slate-800 p-3 rounded-lg shadow-lg border border-emerald-500/30">
          <p className="font-semibold text-slate-100">{payload[0].name}</p>
          <p className="text-sm text-slate-300">
            ₹{payload[0].value.toLocaleString("en-IN")} ({percent}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold text-[11px]"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  if (chartData.length === 0) {
    return (
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
            <PieIcon className="h-5 w-5 text-emerald-500" />
            Expense Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-slate-400">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
          <PieIcon className="h-5 w-5 text-emerald-500" />
          Expense Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={140}
                innerRadius={85}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ color: "#cbd5e1", fontSize: "13px", marginTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[55%] text-center pointer-events-none">
            <p className="text-3xl font-bold text-slate-100">
              ₹{summary.expense.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-slate-400">Total</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DonutChart
