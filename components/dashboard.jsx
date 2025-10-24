"use client";

import { Card } from "@/components/ui/card";

export default function Dashboard({ expenses }) {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const todaySpent = expenses
        .filter((e) => e.date === today)
        .reduce((sum, e) => sum + e.amount, 0);
    const weekSpent = expenses
        .filter((e) => e.date >= weekAgo)
        .reduce((sum, e) => sum + e.amount, 0);

    const stats = [
        {
            label: "Total Spent",
            value: `₹${totalSpent.toFixed(2)}`,
            color: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            label: "Today",
            value: `₹${todaySpent.toFixed(2)}`,
            color: "bg-green-50 dark:bg-green-900/20",
        },
        {
            label: "This Week",
            value: `₹${weekSpent.toFixed(2)}`,
            color: "bg-purple-50 dark:bg-purple-900/20",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
                <Card key={stat.label} className={`p-6 ${stat.color} border-0`}>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {stat.value}
                    </p>
                </Card>
            ))}
        </div>
    );
}
