"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

export default function AnalyticsSummary({ expenses }) {
    if (expenses.length === 0) return null;

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgExpense = totalSpent / expenses.length;
    const maxExpense = Math.max(...expenses.map((e) => e.amount));
    const minExpense = Math.min(...expenses.map((e) => e.amount));

    const uniqueDates = new Set(expenses.map((e) => e.date));
    const dailyAverage = totalSpent / uniqueDates.size;

    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        .toISOString()
        .slice(0, 7);

    const currentMonthSpent = expenses
        .filter((e) => e.date.startsWith(currentMonth))
        .reduce((sum, e) => sum + e.amount, 0);
    const lastMonthSpent = expenses
        .filter((e) => e.date.startsWith(lastMonth))
        .reduce((sum, e) => sum + e.amount, 0);

    const monthTrend =
        lastMonthSpent > 0
            ? ((currentMonthSpent - lastMonthSpent) / lastMonthSpent) * 100
            : 0;

    const metrics = [
        {
            label: "Average Expense",
            value: `₹${avgExpense.toFixed(2)}`,
            icon: DollarSign,
            color: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            label: "Daily Average",
            value: `₹${dailyAverage.toFixed(2)}`,
            icon: TrendingUp,
            color: "bg-green-50 dark:bg-green-900/20",
        },
        {
            label: "Highest Expense",
            value: `₹${maxExpense.toFixed(2)}`,
            icon: Target,
            color: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
            label: "Month Trend",
            value: `${monthTrend > 0 ? "+" : ""}${monthTrend.toFixed(1)}%`,
            icon: monthTrend > 0 ? TrendingUp : TrendingDown,
            color:
                monthTrend > 0
                    ? "bg-red-50 dark:bg-red-900/20"
                    : "bg-green-50 dark:bg-green-900/20",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                    <Card
                        key={metric.label}
                        className={`p-4 ${metric.color} border-0`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    {metric.label}
                                </p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {metric.value}
                                </p>
                            </div>
                            <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
