"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setFilters } from "../store/transactionSlice"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Filter, X } from "lucide-react"

const FilterSection = ({ onClearFilters }) => {
  const dispatch = useDispatch()
  const { filters } = useSelector((state) => state.transactions)
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    "salary",
    "freelance",
    "investment",
    "groceries",
    "entertainment",
    "transport",
    "shopping",
    "bills",
    "healthcare",
    "education",
    "food",
    "other",
  ]

  const handleFilterChange = (name, value) => {
    const filterValue = value === "all" ? "" : value
    dispatch(setFilters({ [name]: filterValue }))
  }

  const hasActiveFilters = filters.type || filters.category || filters.startDate || filters.endDate

  return (
    <Card className="border border-emerald-500/20 shadow-lg bg-slate-900/50 backdrop-blur-md rounded-2xl">
      <CardContent className="pt-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors duration-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-emerald-500/20">
            {/* Type Filter */}
            <div className="space-y-2">
              <Label className="text-slate-300">Type</Label>
              <Select
                value={filters.type || "all"}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger className="bg-slate-800/60 border-emerald-500/30 text-slate-200 focus:ring-emerald-400 focus:border-emerald-400">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 border border-emerald-500/30 text-white shadow-lg shadow-emerald-500/20 backdrop-blur-md">
                  <SelectItem
                    value="all"
                    className="hover:bg-emerald-500/10 data-[state=checked]:bg-emerald-500/20 data-[state=checked]:text-emerald-300"
                  >
                    All Types
                  </SelectItem>
                  <SelectItem
                    value="income"
                    className="hover:bg-emerald-500/10 data-[state=checked]:bg-emerald-500/20 data-[state=checked]:text-emerald-300"
                  >
                    Income
                  </SelectItem>
                  <SelectItem
                    value="expense"
                    className="hover:bg-emerald-500/10 data-[state=checked]:bg-emerald-500/20 data-[state=checked]:text-emerald-300"
                  >
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-slate-300">Category</Label>
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="bg-slate-800/60 border-emerald-500/30 text-slate-200 focus:ring-emerald-400 focus:border-emerald-400">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 border border-emerald-500/30 text-white shadow-lg shadow-emerald-500/20 backdrop-blur-md">
                  <SelectItem
                    value="all"
                    className="hover:bg-emerald-500/10 data-[state=checked]:bg-emerald-500/20 data-[state=checked]:text-emerald-300"
                  >
                    All Categories
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="hover:bg-emerald-500/10 data-[state=checked]:bg-emerald-500/20 data-[state=checked]:text-emerald-300 capitalize"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date Filter */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-slate-300">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="bg-slate-800/60 border-emerald-500/30 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400 cursor-pointer"
              />
            </div>

            {/* End Date Filter */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-slate-300">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="bg-slate-800/60 border-emerald-500/30 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FilterSection
