import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const ChartSection = () => {
  const { summary, categoryBreakdown, loading } = useSelector((state) => state.transactions)

  const COLORS = [
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ]

  // Data for Income vs Expense Pie Chart
  const pieData = [
    { name: "Income", value: summary.income },
    { name: "Expenses", value: summary.expense },
  ]

  // Data for Category Bar Chart
  const barData = categoryBreakdown.map((item) => ({
    category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    amount: item.total,
    type: item.type,
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-lg shadow-lg border border-emerald-500/30">
          <p className="font-semibold text-slate-200">{payload[0].name}</p>
          <p className="text-sm text-emerald-400">₹{payload[0].value.toLocaleString("en-IN")}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-emerald-500/20 shadow-lg bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="h-64 bg-slate-700/50 animate-pulse rounded"></div>
          </CardContent>
        </Card>
        <Card className="border border-emerald-500/20 shadow-lg bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="h-64 bg-slate-700/50 animate-pulse rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income vs Expense Pie Chart */}
      <Card className="border border-emerald-500/20 shadow-lg bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-200">Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.income === 0 && summary.expense === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown Bar Chart */}
      <Card className="border border-emerald-500/20 shadow-lg bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-200">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryBreakdown.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 12, fill: "#cbd5e1" }}
                />
                <YAxis tick={{ fill: "#cbd5e1" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === "income" ? "#10b981" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ChartSection
