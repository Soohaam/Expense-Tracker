"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTransactions, fetchSummary, fetchCategoryBreakdown, clearFilters } from "../store/transactionSlice"
import SummaryCards from "./SummaryCards"
import TransactionForm from "./TransactionForm"
import TransactionList from "./TransactionList"
import FilterSection from "./FilterSection"
import ChartSection from "./ChartSection"
import { Toaster } from "./ui/toaster"
import { Button } from "./ui/button"
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react"
import Chatbot from "./Chatbot"
import AIReview from "./AIReview"
import DonutChart from "./DonutChart"
import SpendingHeatmap from "./SpendingHeatmap"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { loading, filters } = useSelector((state) => state.transactions)
  const [showForm, setShowForm] = useState(false)
  const [showAIReview, setShowAIReview] = useState(false);

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = () => {
    dispatch(fetchTransactions(filters))
    dispatch(fetchSummary(filters))
    dispatch(fetchCategoryBreakdown(filters.type))
  }

  const handleRefresh = () => {
    loadData()
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Chatbot />
      <Toaster />

      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm shadow-lg border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left Section: Back Button + Title */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.history.back()}
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-100">Expense Tracker</h1>
                <p className="text-slate-400 mt-1">Manage your income and expenses efficiently</p>
              </div>
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex gap-3">
                <Button
  onClick={() => setShowAIReview(true)}
  size="sm"
  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-none font-semibold shadow-lg shadow-emerald-500/30"
>
  <Sparkles className="h-4 w-4 mr-2" />
  AI Overview
</Button>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                + Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Summary Cards */}
          <SummaryCards />

          {/* Filters */}
          <FilterSection onClearFilters={handleClearFilters} />

          {/* Charts */}
          <ChartSection />

          {/* New Visualizations: Donut Chart & Spending Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart />
            <SpendingHeatmap />
          </div>

          {/* Transaction List */}
          <TransactionList />
        </div>
      </div>

      {/* AI Review Modal */}
      <AIReview
        open={showAIReview}
        onClose={() => setShowAIReview(false)}
      />

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            loadData()
          }}
        />
      )}

       

    </div>
  )
}

export default Dashboard
