import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react"

const SummaryCards = () => {
  const { summary, loading } = useSelector((state) => state.transactions)

  const cards = [
    {
      title: "Total Income",
      value: summary.income,
      icon: ArrowUpCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
    {
      title: "Total Expenses",
      value: summary.expense,
      icon: ArrowDownCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      title: "Balance",
      value: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 ? "text-blue-400" : "text-orange-400",
      bgColor: summary.balance >= 0 ? "bg-blue-500/10" : "bg-orange-500/10",
      borderColor: summary.balance >= 0 ? "border-blue-500/30" : "border-orange-500/30",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`border ${card.borderColor} shadow-lg bg-slate-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-slate-700/50 animate-pulse rounded"></div>
            ) : (
              <div className={`text-3xl font-bold ${card.color}`}>₹{card.value.toLocaleString("en-IN")}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SummaryCards
