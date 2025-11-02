"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { createTransaction, updateTransaction } from "../store/transactionSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useToast } from "../hooks/use-toast"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

const TransactionForm = ({ open, onClose, transaction, onSuccess }) => {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date())

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "",
  })

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
      })
      setDate(new Date(transaction.date))
    }
  }, [transaction])

  const categories = {
    income: ["salary", "freelance", "investment", "bonus", "other"],
    expense: [
      "groceries",
      "entertainment",
      "transport",
      "shopping",
      "bills",
      "healthcare",
      "education",
      "food",
      "other",
    ],
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      category: "",
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      ...formData,
      amount: Number.parseFloat(formData.amount),
      date: date.toISOString(),
    }

    try {
      if (transaction) {
        await dispatch(updateTransaction({ id: transaction._id, data })).unwrap()
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        })
      } else {
        await dispatch(createTransaction(data)).unwrap()
        toast({
          title: "Success",
          description: "Transaction created successfully",
        })
      }
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-emerald-500/30">
        <DialogHeader>
          <DialogTitle className="text-slate-200">
            {transaction ? "Edit Transaction" : "Add New Transaction"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="space-y-2">
            <Label className="text-slate-300">Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-slate-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-emerald-500/30 text-slate-200">
                <SelectItem value="income" className="hover:bg-emerald-500/20 text-slate-200">Income</SelectItem>
                <SelectItem value="expense" className="hover:bg-emerald-500/20 text-slate-200">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-300">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
              className="bg-slate-800/50 border-emerald-500/30 text-slate-200 placeholder:text-slate-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-slate-300">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-slate-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-emerald-500/30 text-slate-200">
                {categories[formData.type].map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="hover:bg-emerald-500/20 text-slate-200"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={3}
              required
              className="bg-slate-800/50 border-emerald-500/30 text-slate-200 placeholder:text-slate-500"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-slate-300">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-slate-800/50 border-emerald-500/30 text-slate-200 hover:bg-slate-800"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-emerald-500/30 text-slate-200">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="text-slate-200 [&_.rdp-day_selected]:bg-emerald-600 [&_.rdp-day_selected]:text-white [&_.rdp-day:hover]:bg-emerald-500/20 [&_.rdp-day]:text-slate-200 [&_.rdp-caption_label]:text-emerald-400 [&_.rdp-nav_button]:text-emerald-400"
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-slate-800 text-slate-200 border-emerald-500/30 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {loading ? "Saving..." : transaction ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionForm
