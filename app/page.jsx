"use client";

import { useState, useEffect } from "react";
import ExpenseList from "@/components/expense-list";
import Dashboard from "@/components/dashboard";
import AIInsights from "@/components/ai-insights";
import TrendChart from "@/components/trend-chart";
import CategoryChart from "@/components/category-chart";
import MonthlyBreakdown from "@/components/monthly-breakdown";
import AnalyticsSummary from "@/components/analytics-summary";
import ThemeToggle from "@/components/theme-toggle";
import ExpenseForm from "@/components/expense-form";

export default function Home() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("expenses");
        if (saved) {
            try {
                setExpenses(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load expenses:", e);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem("expenses", JSON.stringify(expenses));
        }
    }, [expenses, loading]);

    const addExpense = (expense) => {
        const newExpense = {
            ...expense,
            id: Date.now().toString(),
        };
        setExpenses([newExpense, ...expenses]);
    };

    const deleteExpense = (id) => {
        setExpenses(expenses.filter((e) => e.id !== id));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">
                        Loading your expenses...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex gap-2 items-center">
                            <img
                                src="/logo.jpg"
                                alt="logo"
                                className=" w-16 h-16 rounded-full"
                            />
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                                Fiscal Fox
                            </h1>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                            Track, categorize, and optimize your spending with
                            AI insights
                        </p>
                    </div>
                    <ThemeToggle />
                </div>

                <Dashboard expenses={expenses} />

                <AnalyticsSummary expenses={expenses} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-1">
                        <ExpenseForm onAddExpense={addExpense} />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <CategoryChart expenses={expenses} />
                        <TrendChart expenses={expenses} />
                    </div>
                </div>

                <MonthlyBreakdown expenses={expenses} />
                <AIInsights expenses={expenses} />
                <ExpenseList
                    expenses={expenses}
                    onDeleteExpense={deleteExpense}
                />
            </div>
        </main>
    );
}
