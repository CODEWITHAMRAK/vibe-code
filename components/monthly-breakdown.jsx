"use client";

import { Card } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function MonthlyBreakdown({ expenses }) {
    // Get last 12 months of data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return {
            month: date.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
            }),
            date: date.toISOString().slice(0, 7),
        };
    });

    const data = monthlyData.map((m) => {
        const monthExpenses = expenses
            .filter((e) => e.date.startsWith(m.date))
            .reduce((sum, e) => sum + e.amount, 0);
        return {
            month: m.month,
            amount: monthExpenses,
        };
    });

    return (
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Monthly Spending
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        formatter={(value) => `₹${value.toFixed(2)}`}
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "none",
                            borderRadius: "8px",
                        }}
                    />
                    <Bar
                        dataKey="amount"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}
