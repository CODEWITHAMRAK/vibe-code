"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const CATEGORY_COLORS = {
    Food: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    Transport:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Entertainment:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Shopping:
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    Utilities:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Health: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Education:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export default function ExpenseList({ expenses, onDeleteExpense }) {
    if (expenses.length === 0) {
        return (
            <Card className="p-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                    No expenses yet. Add one to get started!
                </p>
            </Card>
        );
    }

    return (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Recent Expenses
                </h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {expenses.map((expense) => (
                    <div
                        key={expense.id}
                        className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-medium text-slate-900 dark:text-white">
                                    {expense.name}
                                </h4>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        CATEGORY_COLORS[expense.category] ||
                                        CATEGORY_COLORS.Other
                                    }`}
                                >
                                    {expense.category}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {new Date(expense.date).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    }
                                )}
                            </p>
                            {expense.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                    {expense.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-slate-900 dark:text-white">
                                ₹{expense.amount.toFixed(2)}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteExpense(expense.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
