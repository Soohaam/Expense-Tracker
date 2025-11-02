"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteTransaction } from "../store/transactionSlice"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "../hooks/use-toast"
import TransactionForm from "./TransactionForm"

const TransactionList = () => {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { transactions, loading } = useSelector((state) => state.transactions)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [editTransaction, setEditTransaction] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)

  const handleDelete = async () => {
    try {
      await dispatch(deleteTransaction(selectedTransaction._id)).unwrap()
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      })
      setDeleteDialogOpen(false)
      setSelectedTransaction(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  const openDeleteDialog = (transaction) => {
    setSelectedTransaction(transaction)
    setDeleteDialogOpen(true)
  }

  const openEditForm = (transaction) => {
    setEditTransaction(transaction)
    setShowEditForm(true)
  }

  if (loading && transactions.length === 0) {
    return (
      <Card className="border border-emerald-500/20 shadow-lg bg-slate-900/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-slate-700/50 animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border border-emerald-500/20 shadow-lg bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-200">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm mt-1">Add your first transaction to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-emerald-500/20 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Category</TableHead>
                    <TableHead className="text-slate-300">Description</TableHead>
                    <TableHead className="text-right text-slate-300">Amount</TableHead>
                    <TableHead className="text-right text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id} className="border-emerald-500/20 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-slate-300">
                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.type === "income" ? "default" : "destructive"}
                          className={`flex items-center gap-1 w-fit ${
                            transaction.type === "income"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpCircle className="h-3 w-3" />
                          ) : (
                            <ArrowDownCircle className="h-3 w-3" />
                          )}
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <span className="capitalize">{transaction.category}</span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-400">{transaction.description}</TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          transaction.type === "income" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(transaction)}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(transaction)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-emerald-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-200">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-slate-200 border-emerald-500/30 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Transaction Form */}
      {showEditForm && (
        <TransactionForm
          open={showEditForm}
          onClose={() => {
            setShowEditForm(false)
            setEditTransaction(null)
          }}
          transaction={editTransaction}
          onSuccess={() => {
            setShowEditForm(false)
            setEditTransaction(null)
          }}
        />
      )}
    </>
  )
}

export default TransactionList
